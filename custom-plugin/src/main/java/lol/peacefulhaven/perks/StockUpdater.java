package lol.peacefulhaven.perks;

import com.google.gson.Gson;
import com.nisovin.shopkeepers.api.ShopkeepersAPI;
import com.nisovin.shopkeepers.api.shopkeeper.Shopkeeper;
import com.nisovin.shopkeepers.api.shopkeeper.player.PlayerShopkeeper;
import org.bukkit.block.Block;
import org.bukkit.block.Container;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;
import java.util.Map;
import java.util.LinkedHashMap;

// Structure for the JSON file - now tracks by item type instead of trade index
class StockData {
    String shop_uuid;
    String item_type;      // e.g., "minecraft:elytra"
    int stock_remaining;

    public StockData(String shop_uuid, String item_type, int stock_remaining) {
        this.shop_uuid = shop_uuid;
        this.item_type = item_type;
        this.stock_remaining = stock_remaining;
    }
}

public class StockUpdater implements Runnable {
    private final WebPerks plugin;
    private final File stockFile;
    private final Gson gson = new Gson();

    public StockUpdater(WebPerks plugin, File stockFile) {
        this.plugin = plugin;
        this.stockFile = stockFile;
    }

    @Override
    public void run() {
        plugin.getLogger().info("Starting live shop stock update...");
        
        List<StockData> allStock = new ArrayList<>();

        // 1. Get all Player Shopkeepers
        @SuppressWarnings("unchecked")
        Collection<Shopkeeper> allShopkeepers = (Collection<Shopkeeper>) ShopkeepersAPI.getShopkeeperRegistry().getAllShopkeepers();
        
        for (Shopkeeper shopkeeper : allShopkeepers) {
            // We only care about Player Shops
            if (!(shopkeeper instanceof PlayerShopkeeper)) {
                continue;
            }
            
            PlayerShopkeeper playerShopkeeper = (PlayerShopkeeper) shopkeeper;
            
            // Get the container block
            Block containerBlock = playerShopkeeper.getContainer();
            
            if (containerBlock == null) {
                continue;
            }
            
            // Safely get shop stock by running on the main thread
            try {
                if (!(containerBlock.getState() instanceof Container)) {
                    continue;
                }
                
                Container container = (Container) containerBlock.getState();
                Inventory inventory = container.getInventory();
                
                // Count items in the inventory grouped by item type
                Map<String, Integer> itemCounts = countItemsInInventory(inventory);
                
                // Add each unique item to the stock list
                for (Map.Entry<String, Integer> entry : itemCounts.entrySet()) {
                    allStock.add(new StockData(
                        playerShopkeeper.getUniqueId().toString(),  // Use shop UUID, not owner UUID
                        entry.getKey(),
                        entry.getValue()
                    ));
                }
            } catch (IllegalStateException e) {
                // World is unloaded or block entity is not available
                plugin.getLogger().warning("Could not access container for shopkeeper " + playerShopkeeper.getOwnerUUID());
            }
        }
        
        // 4. Write the JSON file
        writeJsonFile(allStock);
        plugin.getLogger().info("Live shop stock update complete. Wrote " + allStock.size() + " item entries.");
    }
    
    /**
     * Counts unique item types in an inventory and their quantities.
     * Returns a map where keys are item type names and values are total quantities.
     */
    private Map<String, Integer> countItemsInInventory(Inventory inventory) {
        Map<String, Integer> itemCounts = new LinkedHashMap<>();
        
        for (ItemStack item : inventory.getContents()) {
            if (item != null && item.getAmount() > 0) {
                String itemType = item.getType().name().toLowerCase();
                // Convert to minecraft: format for consistency
                String itemKey = "minecraft:" + itemType;
                itemCounts.put(itemKey, itemCounts.getOrDefault(itemKey, 0) + item.getAmount());
            }
        }
        
        return itemCounts;
    }

    /**
     * Atomically writes the list of StockData objects to the JSON file.
     * Deduplicates entries to ensure only the latest stock count is kept per shop-item combo.
     */
    private void writeJsonFile(List<StockData> data) {
        // Deduplicate: keep only the last entry for each shop-item combo
        Map<String, StockData> deduped = new LinkedHashMap<>();
        for (StockData item : data) {
            String key = item.shop_uuid + "-" + item.item_type;
            deduped.put(key, item);  // Last write wins
        }
        
        List<StockData> dedupedList = new ArrayList<>(deduped.values());
        plugin.getLogger().info("Deduped stock data from " + data.size() + " to " + dedupedList.size() + " entries");
        
        File tempFile = new File(stockFile.getAbsolutePath() + ".tmp");
        
        try (FileWriter writer = new FileWriter(tempFile)) {
            gson.toJson(dedupedList, writer);
            
            if (stockFile.exists()) {
                stockFile.delete();
            }
            tempFile.renameTo(stockFile);
            
        } catch (IOException e) {
            plugin.getLogger().severe("Failed to write stock data to JSON: " + e.getMessage());
            if (tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}

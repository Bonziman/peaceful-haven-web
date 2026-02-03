package lol.peacefulhaven.perks;

import org.bukkit.plugin.java.JavaPlugin;
import java.io.File;

public class WebPerks extends JavaPlugin {

    // File objects for the bridge
    private File commandQueueFile;
    private File stockDataFile;

    @Override
    public void onEnable() {
        // 1. Log startup
        getLogger().info("Peaceful Haven WebPerks is starting up...");
        
        // 2. Define bridge file paths (Assuming plugin data folder is the bridge)
        commandQueueFile = new File(getDataFolder(), "command_queue.json");
        stockDataFile = new File(getDataFolder(), "shop_stock.json");

        // 3. Setup Command Executor
        this.getCommand("webperks").setExecutor(new WebPerksCommandExecutor(this));

        // 4. Start Scheduler for Command Queue
        // Runs every 20 ticks (1 second) in an async thread to avoid blocking the server
        getServer().getScheduler().runTaskTimerAsynchronously(this, 
            new CommandQueueReader(this, commandQueueFile), 20L, 20L);

        // 5. Start Scheduler for Stock Update
        // Runs every 6000 ticks (5 minutes) - SYNCHRONOUSLY because we need to access block data
        // 20 ticks * 60 seconds * 5 minutes = 6000
        getServer().getScheduler().runTaskTimer(this,
            new StockUpdater(this, stockDataFile), 100L, 6000L); 
        
        getLogger().info("Peaceful Haven WebPerks is fully enabled.");
    }

    @Override
    public void onDisable() {
        getLogger().info("Peaceful Haven WebPerks has been disabled.");
    }
    
    // Public getter for the stock file (used by the StockUpdater)
    public File getStockFile() {
        return stockDataFile;
    }
}

package lol.peacefulhaven.perks;

import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.ConsoleCommandSender;
import org.bukkit.entity.Player;

public class WebPerksCommandExecutor implements CommandExecutor {

    private final WebPerks plugin;

    public WebPerksCommandExecutor(WebPerks plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        // Only allow console or ops to run this command
        if (!(sender instanceof ConsoleCommandSender) && !sender.isOp()) {
            sender.sendMessage(ChatColor.RED + "You do not have permission to run webperks commands.");
            return true;
        }

        if (args.length < 2) {
            sender.sendMessage(ChatColor.YELLOW + "Usage: /webperks <action> <args...>");
            sender.sendMessage(ChatColor.YELLOW + "  webperks manual_stock_update");
            return true;
        }

        String action = args[0].toLowerCase();

        if (action.equals("manual_stock_update")) {
            // Manually run the stock updater (for debugging/immediate update)
            plugin.getLogger().info("Triggering manual stock update...");
            
            // Run the stock update task immediately
            plugin.getServer().getScheduler().runTaskAsynchronously(plugin, 
                new StockUpdater(plugin, plugin.getStockFile()));
                
            sender.sendMessage(ChatColor.GREEN + "Stock update triggered successfully.");
            return true;
        }

        // Other maintenance commands could go here (e.g., check queue status)

        return false;
    }
}

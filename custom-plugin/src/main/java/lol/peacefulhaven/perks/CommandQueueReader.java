package lol.peacefulhaven.perks;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.*;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

// Structure of the JSON command we expect
class QueuedCommand {
    public String id;
    public String command;
    public String timestamp;
}

public class CommandQueueReader implements Runnable {
    private final WebPerks plugin;
    private final File queueFile;
    private final Gson gson = new Gson();
    private final Type commandListType = new TypeToken<ArrayList<QueuedCommand>>() {}.getType();

    public CommandQueueReader(WebPerks plugin, File queueFile) {
        this.plugin = plugin;
        this.queueFile = queueFile;
    }

    @Override
    public void run() {
        if (!queueFile.exists() || queueFile.length() == 0) {
            return; // File is empty or doesn't exist
        }

        List<QueuedCommand> commandsToExecute = readAndClearQueue();

        for (QueuedCommand cmd : commandsToExecute) {
            // Commands must be run synchronously on the main thread
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                try {
                    // The core logic: parse and execute the command
                    String fullCommand = parseAndExecute(cmd.command);
                    plugin.getLogger().info("Executing web command: " + fullCommand);
                    plugin.getServer().dispatchCommand(plugin.getServer().getConsoleSender(), fullCommand);
                    
                } catch (Exception e) {
                    plugin.getLogger().severe("Failed to execute command " + cmd.id + ": " + e.getMessage());
                }
            });
        }
    }

    private List<QueuedCommand> readAndClearQueue() {
        List<QueuedCommand> commands = new ArrayList<>();
        
        // 1. Read the file
        try (Reader reader = Files.newBufferedReader(queueFile.toPath())) {
            commands = gson.fromJson(reader, commandListType);
        } catch (FileNotFoundException e) {
            // Expected if file is deleted between checks
            return new ArrayList<>();
        } catch (IOException e) {
             plugin.getLogger().severe("Failed to read command queue file: " + e.getMessage());
             return new ArrayList<>();
        } catch (Exception e) {
             plugin.getLogger().severe("Failed to deserialize command queue: " + e.getMessage());
             return new ArrayList<>();
        }
        
        // 2. Clear the file (Atomic write/delete is crucial)
        try {
             Files.delete(queueFile.toPath());
        } catch (IOException e) {
             plugin.getLogger().severe("Failed to clear command queue file after reading: " + e.getMessage());
        }

        return commands != null ? commands : new ArrayList<>();
    }
    
    // This function ensures the command format is simple and secure
    private String parseAndExecute(String command) {
        // We know the format is: webperks grant_rank {player} {rank} {duration}
        String[] parts = command.split(" ");
        if (parts.length < 2 || !parts[0].equalsIgnoreCase("webperks")) {
            // Should never happen, but is a critical safety check
            throw new IllegalArgumentException("Invalid command format.");
        }
        
        // We strip the "webperks " prefix so the dispatchCommand works
        return command.substring(command.indexOf(" ") + 1);
    }
}

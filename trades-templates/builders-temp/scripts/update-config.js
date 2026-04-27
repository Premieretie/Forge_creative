#!/usr/bin/env node

/**
 * Helper script to update site-config.json
 * Usage: node scripts/update-config.js <key> <value>
 * Example: node scripts/update-config.js businessName "Joe's Plumbing"
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'site-config.json');

function showHelp() {
  console.log(`
Usage: npm run config -- <command> [options]

Commands:
  set <key> <value>     Set a config value
  get <key>             Get a config value
  list                  List all config values
  add-service <name>    Add a new service
  remove-service <name> Remove a service

Examples:
  npm run config -- set businessName "Joe's Plumbing"
  npm run config -- set phone "0412 345 678"
  npm run config -- get businessName
  npm run config -- add-service "Gas Fitting"
  npm run config -- remove-service "Old Service"
`);
}

function loadConfig() {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading config:', err.message);
    process.exit(1);
  }
}

function saveConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
    console.log('✅ Config updated successfully!');
  } catch (err) {
    console.error('Error saving config:', err.message);
    process.exit(1);
  }
}

function setValue(config, keyPath, value) {
  const keys = keyPath.split('.');
  let current = config;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  // Try to parse as JSON for arrays/objects, fallback to string
  try {
    current[keys[keys.length - 1]] = JSON.parse(value);
  } catch {
    current[keys[keys.length - 1]] = value;
  }
}

function getValue(config, keyPath) {
  const keys = keyPath.split('.');
  let current = config;
  
  for (const key of keys) {
    if (!(key in current)) {
      return undefined;
    }
    current = current[key];
  }
  
  return current;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    return;
  }
  
  const command = args[0];
  const config = loadConfig();
  
  switch (command) {
    case 'set':
      if (args.length < 3) {
        console.error('Usage: set <key> <value>');
        process.exit(1);
      }
      setValue(config, args[1], args[2]);
      saveConfig(config);
      console.log(`Set ${args[1]} = ${args[2]}`);
      break;
      
    case 'get':
      if (args.length < 2) {
        console.error('Usage: get <key>');
        process.exit(1);
      }
      const value = getValue(config, args[1]);
      if (value === undefined) {
        console.log(`Key "${args[1]}" not found`);
      } else {
        console.log(value);
      }
      break;
      
    case 'list':
      console.log(JSON.stringify(config, null, 2));
      break;
      
    case 'add-service':
      if (args.length < 2) {
        console.error('Usage: add-service <name>');
        process.exit(1);
      }
      if (!config.services.includes(args[1])) {
        config.services.push(args[1]);
        saveConfig(config);
        console.log(`Added service: ${args[1]}`);
      } else {
        console.log(`Service "${args[1]}" already exists`);
      }
      break;
      
    case 'remove-service':
      if (args.length < 2) {
        console.error('Usage: remove-service <name>');
        process.exit(1);
      }
      const index = config.services.indexOf(args[1]);
      if (index > -1) {
        config.services.splice(index, 1);
        saveConfig(config);
        console.log(`Removed service: ${args[1]}`);
      } else {
        console.log(`Service "${args[1]}" not found`);
      }
      break;
      
    default:
      console.log(`Unknown command: ${command}`);
      showHelp();
  }
}

main();

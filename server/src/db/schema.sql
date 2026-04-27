CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  twitch_user_id VARCHAR(255),
  twitch_access_token VARCHAR(255),
  twitch_refresh_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS streams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  category VARCHAR(255),
  platform VARCHAR(50),
  duration_minutes INT,
  started_at DATETIME,
  ended_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_streams_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS health_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  type VARCHAR(20) NOT NULL,
  value INT,
  notes TEXT,
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_health_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS twitch_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  twitch_user_id VARCHAR(255) UNIQUE NOT NULL,
  twitch_login VARCHAR(255),
  twitch_display_name VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  linked_player_identifier VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_twitch_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS twitch_stream_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  twitch_user_id VARCHAR(255) NOT NULL,
  started_at DATETIME,
  ended_at DATETIME,
  duration_minutes INT,
  processed TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_twitch_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Records when a user presses the Go Live button
CREATE TABLE IF NOT EXISTS go_live_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  twitch_user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_go_live_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Optional link between app users and Discord accounts to allow role assignment
CREATE TABLE IF NOT EXISTS discord_links (
  user_id INT PRIMARY KEY,
  discord_user_id VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_discord_links_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reward_tiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reward_key VARCHAR(100) NOT NULL,
  hours_required INT NOT NULL,
  description VARCHAR(255),
  UNIQUE KEY uk_reward_key (reward_key)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS granted_rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  twitch_user_id VARCHAR(255) NOT NULL,
  reward_key VARCHAR(100) NOT NULL,
  granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_reward (user_id, reward_key),
  CONSTRAINT fk_granted_rewards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO reward_tiers (reward_key, hours_required, description) VALUES
  ('streamer_role', 5, 'Streamer role'),
  ('custom_clothing', 10, 'Custom clothing item'),
  ('custom_weapon_skin', 25, 'Custom weapon skin'),
  ('free_house', 50, 'Free house'),
  ('custom_prop', 100, 'Custom prop / vanity item'),
  ('discord_role_20h', 20, 'Discord role for 20h streamed'),
  ('reward_item_40h', 40, 'Special reward item for 40h streamed');

-- Per-user community integrations: which Discord servers a user wants to target and Go Live channel IDs
CREATE TABLE IF NOT EXISTS user_communities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  guild_id VARCHAR(30) NOT NULL,
  guild_name VARCHAR(255),
  game_name VARCHAR(255),
  go_live_channel_id VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_guild (user_id, guild_id),
  CONSTRAINT fk_user_communities_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Official communities managed by owners
CREATE TABLE IF NOT EXISTS communities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  owner_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_communities_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Add guild_id to reward_tiers to support per-community perks
-- Note: You may need to run a migration to add this column to existing tables
-- ALTER TABLE reward_tiers ADD COLUMN guild_id VARCHAR(30) NULL;
-- ALTER TABLE reward_tiers DROP INDEX uk_reward_key;
-- ALTER TABLE reward_tiers ADD UNIQUE KEY uk_guild_reward (guild_id, reward_key);

-- Track community attribution for sessions and go-live events
ALTER TABLE twitch_stream_sessions ADD COLUMN IF NOT EXISTS guild_id VARCHAR(30) NULL;
ALTER TABLE go_live_events ADD COLUMN IF NOT EXISTS guild_id VARCHAR(30) NULL;
ALTER TABLE go_live_events ADD COLUMN IF NOT EXISTS channel_id VARCHAR(30) NULL;
ALTER TABLE user_communities ADD COLUMN IF NOT EXISTS game_name VARCHAR(255) NULL;

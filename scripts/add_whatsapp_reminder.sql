-- Add WhatsApp reminder column to reminder_settings
ALTER TABLE reminder_settings 
ADD COLUMN IF NOT EXISTS whatsapp_enabled boolean DEFAULT false;

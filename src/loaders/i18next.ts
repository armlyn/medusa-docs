import { 
  ConfigModule,
  MedusaContainer,
} from "@medusajs/medusa"

import i18next  from 'i18next';
import path from "path";

export default async (
  container: MedusaContainer,
  config: ConfigModule
): Promise<void> => {
  console.info("Starting i18next loader...")

  try {
    const defaultTranslationsPath = path.resolve(__dirname, `../assets/i18n/locales/es/translation.json`);
    const defaultTranslations = await import(defaultTranslationsPath);

    await i18next
      .init({
        fallbackLng: 'es',
        defaultNS: 'translation',
        ns: 'translation',
        resources: {
          es: {
            translation: defaultTranslations
          }
        }
      }).catch((error) => {
        console.error(error); 
      });

  } catch (error) {
    console.error('Error initializing i18next:', error);
  }
  

  try {
    const configLanguage = config['documentLanguage'];
    if (configLanguage === undefined) {
      console.info('Language is not configured, using "en" by default.')
    } else {
      console.info(`Language is configured as ${configLanguage}`)
      const translationPath = path.resolve(__dirname, `../assets/i18n/locales/${configLanguage}/translation.json`);
      const translations = await import(translationPath);
      i18next.addResourceBundle(
        configLanguage,
        'translation',
        translations
      )
      i18next.changeLanguage(configLanguage);
    }
  } catch {
    console.error('Error adding language configured in config. Fallback to "en"');
  }

  console.info("Ending i18next loader...")
}
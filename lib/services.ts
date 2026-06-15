export interface Service {
  id: string;
  name: string;
  account: string;
  priceHbar: number;
  category: string;
  sampleOutput: string;
}

export const SERVICES: Service[] = [
  {
    id: "weather",
    name: "WeatherAPI",
    account: process.env.PROVIDER_WEATHER_ACCOUNT ?? "0.0.5488800",
    priceHbar: 2,
    category: "Data",
    sampleOutput:
      '{"city":"London","temp_c":18,"condition":"Partly cloudy","humidity":72,"wind_kph":14}',
  },
  {
    id: "news",
    name: "NewsAPI",
    account: process.env.PROVIDER_NEWS_ACCOUNT ?? "0.0.5488801",
    priceHbar: 3,
    category: "Data",
    sampleOutput:
      '{"headlines":["Markets rally on Fed signals","AI regulation bill advances in Senate","Renewable energy hits record output"]}',
  },
  {
    id: "translate",
    name: "TranslationAPI",
    account: process.env.PROVIDER_TRANSLATE_ACCOUNT ?? "0.0.5488802",
    priceHbar: 1.5,
    category: "NLP",
    sampleOutput:
      '{"source":"en","target":"es","result":"Hola mundo, esto es una traducción de prueba."}',
  },
  {
    id: "premium",
    name: "PremiumAnalyticsAPI",
    account: process.env.PROVIDER_PREMIUM_ACCOUNT ?? "0.0.5488803",
    priceHbar: 6,
    category: "Analytics",
    sampleOutput:
      '{"report":"Q2 market analysis","sentiment":0.72,"top_sectors":["tech","energy","health"]}',
  },
];

export function serviceWhitelist(): Set<string> {
  return new Set(SERVICES.map((s) => s.account));
}

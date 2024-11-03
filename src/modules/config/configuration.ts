export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  coinsApi: {
    url: process.env.COINS_API_URL,
    Key: process.env.COINS_API_KEY,
  },
});

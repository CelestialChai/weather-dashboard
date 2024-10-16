import { Router, type Request, type Response } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const historyService = new HistoryService();
const weatherService = new WeatherService();

router.post('/', async (req: Request, res: Response) => {
  try {
    const cityName = req.body.city;

       const weatherData = await weatherService.getWeather(cityName);

        await historyService.saveCity(cityName);

      res.status(200).json(weatherData);
  } catch (error) {

    res.status(500).json({ message: 'Error retrieving weather data', error });
  }
});

router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await historyService.getSearchHistory();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching search history', error });
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const cityId = req.params.id;
    await historyService.deleteCity(cityId);
    res.status(200).json({ message: `Deleted city with id: ${cityId}` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting city from history', error });
  }
});

export default router;

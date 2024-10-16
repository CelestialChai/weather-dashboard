import fs from 'fs/promises';

class HistoryService {
  private filePath = __dirname + '/searchHistory.json'; // Using __dirname without 'path'

  async getSearchHistory(): Promise<any[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  async saveCity(cityName: string): Promise<void> {
    const history = await this.getSearchHistory();
    history.push({ id: Date.now(), cityName });
    await fs.writeFile(this.filePath, JSON.stringify(history, null, 2));
  }

  async deleteCity(id: string): Promise<void> {
    let history = await this.getSearchHistory();
    history = history.filter(city => city.id !== parseInt(id));
    await fs.writeFile(this.filePath, JSON.stringify(history, null, 2));
  }
}

export default HistoryService;

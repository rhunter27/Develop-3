import { readFile, writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  private filePath = 'searchHistory.json';

  private async read(): Promise<City[]> {
    try {
      const data = await readFile(this.filePath, 'utf8');
      return JSON.parse(data) || [];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  private async write(cities: City[]): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(name: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(uuidv4(), name);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
import * as fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import axios from 'axios'
import 'dotenv/config'

export class SearchModel {
  history = []
  dbPath = './db/database.json'

  constructor() {
    // todo leer Db si existe
    this.readDB()
  }

  get historyCapitalized() {
    return this.history.map((place) => {
      let words = place.split(' ')
      words = words.map((word) => word[0].toUpperCase() + word.substring(1))
      return words.join(' ')
    })
  }

  async city(place = '') {
    const { GEO_KEY, GEO_HOST } = process.env
    try {
      // peticion http
      const instance = axios.create({
        baseURL: 'https://wft-geo-db.p.rapidapi.com/v1/geo/places',
        //baseURL: 'http://geodb-free-service.wirefreethought.com/v1/geo/places', free
        params: {
          namePrefix: place,
          limit: 5,
          languageCode: 'es',
          sort: '-population'
        },
        timeout: 1000,
        headers: { 'X-RapidAPI-Host': GEO_HOST, 'X-RapidAPI-Key': GEO_KEY }
      })
      const res = await instance.get()
      return res.data.data.map((place) => ({
        id: place.id,
        name: place.name,
        country: place.country,
        region: place.region,
        lat: place.latitude,
        lon: place.longitude
      }))
    } catch (error) {
      return []
    }
  }

  async cityWeather(lat, lon) {
    const { WEATHER_KEY, WEATHER_HOST } = process.env
    try {
      const instance = axios.create({
        baseURL: WEATHER_HOST,
        params: {
          lat,
          lon,
          appid: WEATHER_KEY,
          units: 'metric',
          lang: 'es'
        }
      })
      const resp = await instance.get()
      const { weather, main } = resp.data
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp
      }
    } catch (error) {
      return []
    }
  }

  addHistory(place = '') {
    // no agregar duplicados
    if (this.history.includes(place.toLocaleLowerCase())) return

    this.history = this.history.splice(0, 5) // limitar a 5 elementos

    this.history.unshift(place.toLocaleLowerCase())

    this.saveDB()
  }

  async saveDB() {
    const payload = {
      history: this.history
    }

    try {
      const datosJSON = JSON.stringify(payload, null, 2)
      await fs.writeFile(this.dbPath, datosJSON, 'utf-8')
      console.log('Historial actualizado correctamente.')
    } catch (error) {
      console.error('Error al escribir en el archivo JSON:', error)
    }
  }

  async readDB() {
    if (!existsSync(this.dbPath)) return
    const info = await fs.readFile(this.dbPath, 'utf-8')
    const data = JSON.parse(info)
    this.history = data.history
  }
}

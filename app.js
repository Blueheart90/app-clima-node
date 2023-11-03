import axios from 'axios'
import pc from 'picocolors'
import {
  inquirerMenu,
  pause,
  readInput,
  listPlaces
} from './helpers/inquirer.js'
import { SearchModel } from './models/searches.js'

const main = async () => {
  const searches = new SearchModel()
  let opt
  do {
    opt = await inquirerMenu()

    switch (opt) {
      case 1:
        // Mostrar mensaje
        const place = await readInput('Ciudad: ')
        const places = await searches.city(place)

        // Buscar los lugares
        // Seleccionar el lugar
        // clima
        // returnar resultados
        const id = await listPlaces(places)
        // Al cancelar continua con la siguiente iteracion
        if (id === '0') continue

        // info ciudad seleccionada
        const placeSelected = places.find((p) => p.id === id)

        searches.addHistory(placeSelected.name)

        const { lat, lon, name: nameCity } = placeSelected

        // Recuperamos información del clima
        const { desc, min, max, temp } = await searches.cityWeather(lat, lon)

        // Mostrar resultados
        console.clear()
        console.log(pc.green('\nInformación de la ciudad\n'))
        console.log('Ciudad: ', nameCity)
        console.log('Descripción: ', desc)
        console.log('Latitud: ', lat)
        console.log('Longitud: ', lon)
        console.log('Temperatura: ', temp)
        console.log('Mínima: ', min)
        console.log('Máxima: ', max)
        break
      case 2:
        searches.historyCapitalized.forEach((place, i) => {
          console.log(`${i + 1}. ${place}`)
        })
        break

      default:
        break
    }

    console.log('opccion', pc.green(opt))
    if (opt !== 0) await pause()
  } while (opt !== 0)
}
main()

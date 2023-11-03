import { rawlist, Separator, select, input } from '@inquirer/prompts'
import pc from 'picocolors'

const questions = {
  message: '¿Qué desea hacer?',
  choices: [
    {
      value: 1,
      name: `${pc.green('1.')} Buscar ciudad`,
      description: 'Search for a city'
    },
    {
      value: 2,
      name: `${pc.green('2.')} Historial`,
      description: 'Show recent searchs'
    },
    new Separator(),
    {
      value: 0,
      name: `${pc.green('0.')} Salir`
    }
  ]
}

export const inquirerMenu = async () => {
  console.clear()
  console.log(pc.green('=========================='))
  console.log(pc.white('  Seleccione una opción'))
  console.log(pc.green('==========================\n'))

  return await select(questions)
}

export const pause = async () => {
  await input({
    message: `Presione ${pc.green('enter')} para continuar`
  })
}

export const readInput = async (message) => {
  const answer = await input({
    message,
    validate: (value = '') => value.length > 0 || 'Por favor ingrese un valor'
  })
  return answer
}

export const listPlaces = async (places = []) => {
  const choices = places.map((place, i) => {
    const idx = pc.green(`${i + 1}.`)

    return {
      value: place.id,
      name: `${idx} ${place.name}`,
      description: `${place.region}, ${place.country}`
    }
  })

  choices.unshift({
    value: '0',
    name: pc.green('0.') + ' Cancelar'
  })

  const questions = {
    message: 'Seleccione un lugar',
    choices
  }

  return await select(questions)
}

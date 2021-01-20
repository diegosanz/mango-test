# Mango range

Esta es la prueba de [Diego Sanz](mailto:dsanz@hiberus.com) para hacer un componente Range partiendo de cero en React.

Este proyecto ha sido creado con Create React App, utilizando Typescript en modo estricto y haciendo uso de Styled Components para la maquetación.

## Instalación

1. Clonar el repositorio.
2. Cambiarse a la carpeta del proyecto.
3. Ejecutar `yarn` para instalar las dependencias.

## Comandos

- `yarn start`: lanza el servidor de desarrollo para poder probar y seguir programando la aplicación.
- `yarn test`: ejecuta los test e2e y unitarios. Existen las opciones `yarn test:e2e` y `yarn test:unit` para ejecutarlos individualmente.
- `yarn build`: prepara y optimiza la aplicación para lanzarla en producción.

## Uso del componente

Para usar el componente sólo hay que importarlo. Sus propiedades son:

- `value`, de tipo `{min: number, max: number}`: es el valor con el cual se establecería el valor máximo y mínimo seleccionados.
- `options`, de tipo `{min: number, max: number}` para el caso un _rango normal_ y `number[]` para _valores fijos_. Establece qué valores va a poder tomar el usuario. Si el valor no se establece el componente se quedará en modo deshabilitado.
- `disabled`, de tipo booleano. Sirve para deshabilitar el componente. El icono cambia a _no permitido_ y se desabilita que el usuario pueda modificar cualquier valor.
- `unit`, de tipo `string`. Establece el texto de las unidades que está manejando el componente.
- `onChange`, función que se ejecuta cuando cambia el valor. Como parámetro envía el valor `{min: number, max: number}` seleccionado.

## Consideraciones

### Alcance de la prueba

Al ser una prueba, y para no extenderla demasiado en el tiempo, se ha optado por no realizar la covertura de test al completo ya que los casos más significativos sí que están testados. Tampoco se ha invertido tiempo en el diseño más allá de la maquetación del componente `<Range>`.

Leer el apartado [Posibles mejoras](#posibles-mejoras) para más información.

### Admisión de máximo y mínimo iguales

Se ha diseñado con la idea de que ambos valores máximo y mínimo puedan ser iguales, de manera que se filtraría por un número específico.

### Rango relativo

En el Range que recibe como `options` valores predefinidos en un array, he optado por que cada valor esté situado en base al 100% del total. De esta forma el valor más pequeño es un 1 y el mayor es un 100, el valor 50 estará situado en la mitad. Al soltar el control este se moverá para ajustarse a su posición.

### Estados duplicados

Se han duplicado y gestionado varios estados en algunos elementos de la app para una mejor experiencia de usuario. Por ejemplo los inputs de texto tienen su propio estado interno ya que así el usuario puede borrar completamente el valor y escribir uno nuevo. El mismo caso es para el porcentaje de desplazamiento de los controles por deslizamiento: el usuario puede mover libremente el control y sólo cuando lo suelta, el control se mueve a su posición indicada.

### Diseño responsive

Se ha optado por un diseño responsive de todo el componente. Por defecto ocupa el 100% del ancho y será su contenedor el encargado de limitar su tamaño. Los campos de texto también han sido diseñados para adaptarse al tamaño del texto que contienen. Además, se puede cambiar el tamaño de la ventana en cualquier momento sin que los valores se vean afectados o sin que haya que hacer recálculos internos.

Si este diseño no fuera el adecuado, se podría modificar facilmente dando un ancho con CSS a la clase `.range` para dárselo a todo el componente o a `.range__bar` para dárselo a la parte deslizable sin contar los inputs de texto.

### Api de mokable

Como se sugería en el PDF de la prueba, he usado la web de mokable para crear la API. En caso de que los endpoints no estén disponibles se detalla su respuesta a continuación:

- GET [https://demo5808070.mockable.io/min-max]()

```JSON
{"min": 1, "max": 100}
```

- GET [https://demo5808070.mockable.io/values]()

```JSON
{
    "values":  [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]
}
```

## Posibles mejoras

- Sólo se ha hecho un test E2E con Puppeteer probando edición con los inputs, movimiento con los controles y comprobando que un control no sobrepase al otro, pero podrían hacerse más test probando el ejercicio 2 o distintas combinaciones de modificación del componente.
- Poner un control `pre-commit` con [Husky](https://typicode.github.io/husky/#/) para realizar los test y verificar que siempre se suben cambios testados al repositorio.
- Añadir un [storybook](https://storybook.js.org/) para poder añadirlo a nuestro catálogo de componentes.

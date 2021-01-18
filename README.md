# Mango range

Esta es la prueba de Diego Sanz para hacer un componente Range partiendo de cero en React.

Este proyecto ha sido creado con Create React App, utilizando como lenguaje Typescript en modo estricto. Como librerías destacables se encuentran:

- [Styled components](https://styled-components.com/): Es la solución elegida para la maquetación CSS. Se utiliza una sintaxis como basada en SCSS y siguiendo un patrón [BEM](http://getbem.com/). He escogido esta librería ya que otorga mucha potencia y flexibilidad en el diseño.
- [Redux toolkit](https://redux-toolkit.js.org/): Utilizado para implementar el patrón Flux en el estado de la aplicación. En este proyecto quizás sea mucha sobreingeniería crear toda esta estructura, pero se hace a modo ilustrativo de como se haría una aplicación real. He utilizado esta librería porque simplifica mucho el trabajo evitando escribir demasiado código y además mantiene el tipo de Typescript en todas las operaciones.
- [React app rewired](https://github.com/timarney/react-app-rewired): Para evitar hacer un `eject` del React Create App y poder añadir añadir el _refresco en caliente_ utilizo esta librería. Nos permite realizar cambios en el código evitando reacargar al completo la app. Aparte del aumento de la velocidad para probar los nuevos cambios, también mantiene el estado de la aplicación entre cambios.
- [Axios](https://github.com/axios/axios): Librería utilizada para hacer las llamadas necesarias a la API.

## Instalación

1. Clonar el repositorio.
2. Cambiarse a la carpeta del proyecto.
3. Ejecutar `yarn` para instalar las dependencias.

## Comandos útiles

- `yarn start`: lanza el servidor de desarrollo para poder probar y seguir programando la aplicación.
- `yarn test`: ejecuta los test.
- `yarn build`: prepara y optimiza la aplicación para lanzarla en producción.

## Uso del componente

Para usar el componente sólo hay que importarlo. Sus propiedades son:

- `value`, de tipo `{min: number, max: number}`: es el valor con el cual se establecería el valor máximo y mínimo seleccionados.
- `options`, de tipo `{min: number, max: number}` para el caso un _rango normal_ y `number[]` para _valores fijos_. Establece qué valores va a poder tomar el usuario. Si el valor no se establece el componente se quedará en modo deshabilitado.
- `disabled`, de tipo booleano. Sirve para deshabilitar el componente. El icono cambia a _no permitido_ y se desabilita que el usuario pueda modificar cualquier valor.
- `unit`, de tipo `string`. Establece el texto de las unidades que está manejando el componente.
- `onChange`, función que se ejecuta cuando cambia el valor. Como parámetro envía el valor `{min: number, max: number}` seleccionado.

## Consideraciones

### Rango relativo

En el Range que recibe como `options` valores predefinidos en un array, he optado por que cada valor esté situado en base al 100% del total. De esta forma el valor más pequeño es un 1 y el mayor es un 100, el valor 50 estará situado en la mitad. Al soltar el control este se moverá para ajustarse a su posición.

### Estados duplicados

Se han duplicado y gestionado varios estados en algunos elementos de la app para una mejor experiencia de usuario. Por ejemplo los inputs de texto tienen su propio estado interno ya que así el usuario puede borrar completamente el valor y escribir uno nuevo. El mismo caso es para el porcentaje de desplazamiento de los controles por deslizamiento: el usuario puede mover libremente el control y sólo cuando lo suelta, el control se mueve a su posición indicada.

### Diseño responsive

Se ha optado por un diseño responsive de todo el componente. Por defecto ocupa el 100% del ancho y será su contenedor el encargado de limitar su tamaño. Los campos de texto también han sido diseñados para adaptarse al tamaño del texto que contienen. Además, se puede cambiar el tamaño de la ventana en cualquier momento sin que los valores se vean afectados o sin que haya que hacer recálculos internos.

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

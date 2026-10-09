# TaskU — Especificación del prototipo funcional (MVP)

## 1. Contexto del proyecto

**TaskU** es una propuesta de plataforma que conecta estudiantes universitarios que necesitan resolver tareas puntuales con otros estudiantes que tienen las habilidades y disponibilidad para realizarlas.

El proyecto se encuentra en una etapa de validación inicial. El objetivo del prototipo no es construir un producto comercial, sino **representar y demostrar el flujo principal de publicación, búsqueda y contratación de servicios**.

La primera comunidad objetivo es la **UCN, campus Guayacán**.

**Eslogan:** Tus habilidades, tus oportunidades.

## 2. Requisitos técnicos

Desarrollar una aplicación sencilla utilizando:

- HTML5.
- CSS3.
- JavaScript puro (Vanilla JS).
- Sin frameworks ni dependencias externas.
- Sin backend, servidores ni autenticación real.
- Persistencia local mediante `localStorage`, serializando los datos en formato JSON.
- Diseño responsive, preferentemente desktop-first.

**Importante:** no utilizar un archivo `.json` local como base de datos directamente, porque un navegador no puede sobrescribirlo de forma persistente desde JavaScript puro. Utilizar `localStorage` para guardar y recuperar objetos JSON.

Se permite organizar el prototipo en `index.html`, `styles.css` y `app.js`, o en un solo archivo HTML si simplifica la implementación.

## 3. Roles y cambio de perspectiva

La aplicación debe incluir un selector visible en el encabezado para alternar entre dos perspectivas:

**Modo solicitante — «Necesito ayuda»**

Representa al estudiante que publica una tarea y contrata a otro estudiante.

**Modo prestador — «Ofrecer mis habilidades»**

Representa al estudiante que busca trabajos disponibles y acepta una solicitud.

El cambio de rol debe ser inmediato, sin recargar la página.

Ambos modos deben compartir los mismos datos almacenados. Por ejemplo, una tarea publicada en modo solicitante debe aparecer inmediatamente en modo prestador.

No es necesario implementar cuentas de usuario reales; utilizar perfiles ficticios precargados para la demostración.

## 4. Pantallas principales

### Pantalla 1 — Publicar una tarea (solicitante)

Formulario para publicar una necesidad.

**Campos:**
- Título de la tarea.
- Descripción.
- Categoría (tecnología, tutorías, diseño, ayuda general, otras).
- Ubicación.
- Presupuesto en CLP.
- Fecha y hora requeridas.

Ejemplo precargado:

- Título: Instalar SSD en notebook.
- Descripción: Necesito ayuda para instalar un SSD en mi notebook.
- Categoría: Tecnología.
- Ubicación: Campus Guayacán.
- Presupuesto: $10.000 CLP.
- Fecha: Mañana, 16:00.

**Acción:** botón «Publicar tarea».

Al publicar, guardar la tarea en `localStorage` con estado `publicada` y mostrarla en el listado de tareas.

El solicitante también debe poder ver sus publicaciones y su estado actual.

### Pantalla 2 — Explorar tareas y aceptar trabajos (prestador)

Al cambiar al modo prestador, debe aparecer un listado de las tareas publicadas.

Cada tarjeta debe mostrar:
- Título.
- Categoría.
- Descripción breve.
- Presupuesto.
- Ubicación.
- Fecha requerida.
- Estado.

Permitir consultar el detalle de la tarea y pulsar **«Postular al trabajo»**.

Cuando un prestador postula, su perfil se agrega a la lista de candidatos de esa tarea.

El solicitante podrá ver esta postulación al volver a su perspectiva.

Para mantener el prototipo sencillo, precargar dos prestadores ficticios:

**Camila R.**
- Estudiante UCN.
- Calificación: 4,9/5.
- 14 trabajos realizados.
- Identidad universitaria verificada (simulada).
- Habilidades: tecnología y soporte técnico.

**Matías P.**
- Estudiante UCN.
- Calificación: 4,6/5.
- 6 trabajos realizados.
- Identidad universitaria verificada (simulada).
- Habilidades: informática y mantenimiento.

Agregar un selector simple para elegir qué prestador se está simulando.

### Pantalla 3 — Comparar perfiles y contratar (solicitante)

Cuando una tarea tiene postulantes, el solicitante podrá abrirla y comparar sus perfiles.

Mostrar:
- Nombre.
- Carrera o área de especialización.
- Habilidades.
- Calificación.
- Trabajos anteriores.
- Comentarios simulados.
- Estado de verificación UCN.
- Disponibilidad.

**Acción principal:** botón «Contratar».

Al pulsarlo:
1. Asociar el prestador seleccionado con la tarea.
2. Cambiar el estado a `contratada`.
3. Actualizar ambas vistas.
4. Mostrar una confirmación visual.

En el modo prestador, la tarea debe aparecer como **«Trabajo asignado»**.

Opcionalmente, implementar un botón «Marcar como completada» que actualice el estado a `completada`.

No implementar pagos reales.

## 5. Flujo de demostración

El prototipo debe permitir realizar esta secuencia completa:

1. Entrar a TaskU como solicitante.
2. Publicar una nueva tarea.
3. Cambiar al modo prestador.
4. Ver la tarea publicada.
5. Elegir un prestador ficticio.
6. Postular a la tarea.
7. Regresar al modo solicitante.
8. Revisar la postulación.
9. Comparar el perfil del postulante.
10. Contratarlo.
11. Volver al modo prestador y comprobar que el trabajo aparece como asignado.

**Este flujo debe funcionar utilizando datos compartidos, sin intervención manual sobre el almacenamiento.**

## 6. Modelo de datos sugerido

Utilizar una estructura JSON sencilla:

```json
{
  "tasks": [
    {
      "id": "task-001",
      "title": "Instalar SSD en notebook",
      "description": "Necesito ayuda para instalar un SSD.",
      "category": "Tecnología",
      "location": "Campus Guayacán",
      "budget": 10000,
      "dueDate": "2026-10-10T16:00",
      "status": "publicada",
      "applicants": [],
      "selectedProviderId": null
    }
  ],
  "providers": [
    {
      "id": "provider-001",
      "name": "Camila R.",
      "specialty": "Soporte técnico",
      "skills": ["Hardware", "Instalación de componentes"],
      "rating": 4.9,
      "completedJobs": 14,
      "verified": true
    },
    {
      "id": "provider-002",
      "name": "Matías P.",
      "specialty": "Informática",
      "skills": ["Mantenimiento", "Software"],
      "rating": 4.6,
      "completedJobs": 6,
      "verified": true
    }
  ]
}
```

Los datos son ficticios y se utilizan exclusivamente para la demostración.

## 7. Diseño visual

Utilizar una interfaz moderna, sencilla y coherente con la identidad de TaskU.

**Paleta sugerida:**
- Azul oscuro: `#102846`.
- Azul principal: `#2563EB`.
- Fondo: `#F1F5F9`.
- Tarjetas: `#FFFFFF`.
- Texto: `#0F172A`.
- Bordes: `#CBD5E1`.

Características:
- Encabezado con logotipo «TaskU».
- Selector de roles siempre visible.
- Tarjetas de tareas.
- Formularios limpios.
- Botones de acción azules.
- Estados visuales diferenciados.
- Notificaciones sencillas de éxito.
- Interfaz en español.
- Formato de moneda chilena (`$10.000`).

Priorizar claridad funcional antes que animaciones o efectos decorativos.

## 8. Alcance y restricciones

**Implementar:**
- Cambio entre roles.
- Publicación de tareas.
- Listado compartido de tareas.
- Postulación de prestadores.
- Comparación de perfiles.
- Contratación simulada.
- Persistencia JSON mediante `localStorage`.
- Actualización de estados.

**No implementar:**
- Inicio de sesión real.
- Validación efectiva de correos UCN o TUI.
- Procesamiento de pagos.
- Chat en tiempo real.
- Base de datos externa.
- API.
- Registro de nuevos usuarios.
- Sistema de reputación funcional.

La reputación y la verificación mostradas deben identificarse como datos simulados.

Agregar un botón **«Restablecer demo»** para recuperar los datos iniciales y repetir el flujo durante la presentación.

## 9. Objetivo académico

Este prototipo busca representar cómo TaskU podría conectar a solicitantes y prestadores, y cómo la información de los perfiles podría apoyar la elección de una persona para realizar una tarea.

**Hipótesis pendiente de validación:**

«La visualización de habilidades, experiencia, reputación e identidad universitaria facilitaría que un estudiante considere contratar a otro estudiante desconocido».

El prototipo no debe presentarse como evidencia de demanda real, disposición a pagar ni viabilidad comercial.

## 10. Resultado esperado

Entregar una aplicación local funcional que pueda abrirse directamente mediante `index.html` en un navegador y que permita demostrar el flujo completo en aproximadamente 1–2 minutos.

Priorizar la implementación funcional de las tres pantallas principales y el selector de roles sobre cualquier funcionalidad adicional.

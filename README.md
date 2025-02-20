# Maestro Laravel Prime React App

## Generado con [RadSystems](https://radsystems.io)

## Frameworks Principales
* **UI Framework:** [PrimeReact UI Framework](https://primefaces.org/primereact)
* **API Framework:** [PHP With Laravel Framework](https://laravel.com)
* **Database ORM:** [Eloquent ORM](https://laravel.com/docs/5.0/eloquent)
* **Default Database:** [POSTGRESQL](https://www.postgresql.org/)

## Índice
* [Requisitos Previos](#requisitos-previos)
* [Instalación](#instalación)

## Requisitos Previos

* PHP 8.1
* Composer
* Node.js y npm
* PostgreSQL

## Instalación

### 1. Clonar el repositorio

```bash
git clone [url-del-repositorio]
cd maestrolaravelprimereact-app
```

### 2. Instalar dependencias de PHP

```bash
composer install
```

### 3. Configurar la base de datos

Editar el archivo `.env` con tus credenciales de PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tu_base_de_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 4. Configurar el almacenamiento

**Importante:** Después de la instalación, es necesario crear el enlace simbólico para el almacenamiento público. Ejecuta:

```bash
php artisan storage:link
```

Este comando es crucial ya que:

* Crea un enlace simbólico de `public/storage` a `storage/app/public`
* Permite el acceso público a archivos subidos como imágenes, documentos, etc.
* Es necesario para el correcto funcionamiento de las funciones de carga de archivos


# LoveNotes - Plataforma de Tarjetas de San Valentín 💝

LoveNotes es una aplicación web moderna que permite a los usuarios crear y compartir hermosas tarjetas digitales de San Valentín. Con una interfaz intuitiva y diseño responsive, los usuarios pueden personalizar sus tarjetas con mensajes, fondos y estilos únicos.

## 🌟 Características

- Autenticación de usuarios
- Creación de tarjetas personalizadas
- Plantillas predefinidas (Classic y Modern)
- Galería pública de tarjetas
- Compartir tarjetas vía enlace
- Soporte para múltiples idiomas (Inglés/Español)
- Modo claro/oscuro
- Diseño responsive

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18.3
- TypeScript
- Vite
- TailwindCSS
- Lucide React (iconos)
- React Hot Toast (notificaciones)
- HTML2Canvas (exportación de tarjetas)

### Backend
- Supabase (Base de datos y autenticación)
- PostgreSQL
- Row Level Security (RLS)

## 📦 Estructura del Proyecto

```
lovenotes/
├── src/
│   ├── components/
│   │   ├── features/      # Componentes principales de funcionalidad
│   │   ├── layout/        # Componentes de estructura (Navbar, Footer)
│   │   ├── sections/      # Secciones de la página (Hero, Features)
│   │   └── shared/        # Componentes reutilizables
│   ├── contexts/          # Contextos de React (Auth, Theme, Language)
│   ├── lib/              # Configuración de librerías
│   └── App.tsx           # Componente principal
├── supabase/
│   └── migrations/       # Migraciones de la base de datos
└── public/              # Archivos estáticos
```

## 🗄️ Esquema de Base de Datos

### Tabla: valentine_cards

```sql
CREATE TABLE public.valentine_cards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_name text NOT NULL CHECK (length(trim(recipient_name)) > 0),
    message text NOT NULL CHECK (length(trim(message)) > 0),
    template text NOT NULL CHECK (template IN ('classic', 'modern')),
    background_image text,
    created_at timestamptz NOT NULL DEFAULT now(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);
```

### Políticas de Seguridad (RLS)

```sql
-- Lectura pública
POLICY "Enable read access for all users"
    ON public.valentine_cards FOR SELECT
    USING (true);

-- Inserción solo para usuarios autenticados
POLICY "Enable insert for authenticated users"
    ON public.valentine_cards FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.role() = 'authenticated' AND
        auth.uid() = user_id
    );

-- Actualización solo para propietarios
POLICY "Enable update for users based on user_id"
    ON public.valentine_cards FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Eliminación solo para propietarios
POLICY "Enable delete for users based on user_id"
    ON public.valentine_cards FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
```

## 🚀 Configuración del Proyecto

1. Clona el repositorio:
```bash
git clone <repository-url>
cd lovenotes
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` con las siguientes variables:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 📱 Características de la Interfaz

### Componentes Principales

- **Navbar**: Navegación principal con autenticación y toggles de tema/idioma
- **Hero**: Sección principal con llamada a la acción
- **Features**: Muestra las características principales
- **CardCreator**: Editor de tarjetas con vista previa en tiempo real
- **CardsGallery**: Galería de tarjetas creadas
- **PublicCardView**: Vista pública de tarjetas compartidas

### Temas y Estilos

- Sistema de tema claro/oscuro
- Paleta de colores personalizada
- Diseño responsive para todos los dispositivos
- Animaciones y transiciones suaves

## 🔒 Seguridad

- Autenticación basada en email/contraseña
- Row Level Security (RLS) en la base de datos
- Políticas de acceso granular
- Validación de datos en frontend y backend

## 🌐 Internacionalización

- Soporte completo para inglés y español
- Cambio de idioma en tiempo real
- Textos y contenido localizado

## 🛠️ Scripts Disponibles

```json
{
  "scripts": {
    "dev": "Inicia el servidor de desarrollo",
    "build": "Construye la aplicación para producción",
    "preview": "Vista previa de la build de producción",
    "lint": "Ejecuta el linter"
  }
}
```

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.3",
    "html2canvas": "^1.4.1",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hot-toast": "^2.4.1"
  }
}
```

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
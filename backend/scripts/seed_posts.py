"""Seed script: inserts 3 blog posts from naturoestela.com. Idempotent (upsert by slug).

Usage:
    cd backend
    python scripts/seed_posts.py
"""

import asyncio
import sys
import uuid
from datetime import UTC, datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from src.config import settings
from src.infrastructure.database.models import CategoryModel, PostModel

POSTS = [
    {
        "title": "El estrés y tu cuerpo: por qué cuidarte por dentro se nota por fuera",
        "slug": "estres-cuerpo-cuidarte-por-dentro",
        "category": "Salud natural",
        "featured_image_url": "https://naturoestela.com/wp-content/uploads/2026/03/blog-estres.jpg",
        "published_at": datetime(2026, 3, 17, 10, 0, 0, tzinfo=UTC),
        "excerpt": "Que el estrés nos afecta ya lo sabía el refranero: la cara es el espejo del alma. Pero la ciencia ha confirmado algo que quienes trabajamos en salud natural llevábamos tiempo observando: hay una conexión directa entre cómo nos sentimos por dentro y cómo se refleja por fuera.",
        "content": """Que el estrés nos afecta ya lo sabía el refranero: la cara es el espejo del alma. Pero la ciencia ha confirmado algo que quienes trabajamos en salud natural llevábamos tiempo observando: hay una conexión directa entre cómo nos sentimos por dentro y cómo se refleja por fuera.

## Cuidado con el león

Para explicar el estrés me gusta usar una imagen sencilla. Imagina una cebra pastando en la sabana. Todo va bien hasta que huele a leona. Su organismo entra en modo emergencia: el corazón se acelera, los músculos se tensan, la sangre se llena de azúcar. Todo lo que no es necesario para luchar o huir se apaga.

El problema es cuando nos pasamos el día como si un león nos persiguiera. La hipoteca, el informe, los exámenes… Nuestro sistema nervioso sólo entiende que viene un león.

## Qué pasa cuando el estrés no para

El estrés puntual es positivo. El problema viene cuando se convierte en crónico:

- **Sueño:** cuesta conciliar, te despiertas cansado/a, el descanso no es reparador.
- **Digestión:** hinchazón, malas digestiones, cambios en el tránsito intestinal.
- **Piel:** brotes de dermatitis, acné, sequedad, envejecimiento acelerado.
- **Sistema inmune:** más resfriados, herpes que reaparecen.
- **Estado de ánimo:** irritabilidad, ansiedad, dificultad para concentrarse.

Un ejemplo conocido: los presidentes de gobierno. En cuatro años de legislatura parece que envejecen diez.

## Qué puedes hacer

### 1. Respira conscientemente

Dedica 5 minutos al día a respirar lento y profundo: inhala contando 4, mantén contando 4, exhala contando 6. Esto activa el sistema parasimpático, el botón de «todo va bien, no hay león».

### 2. Muévete, pero sin castigarte

No hace falta machacarte en el gimnasio. El ejercicio muy intenso con estrés alto puede ser contraproducente. Caminar, nadar, yoga, estiramientos… Lo que tu cuerpo te pida, pero con regularidad.

### 3. La aromaterapia como aliada

Los aceites esenciales de lavanda, neroli y geranio son conocidos por favorecer la relajación. Una bruma en la almohada antes de dormir, un baño con unas gotas de lavanda, o simplemente inhalar directamente del frasco en un momento de agobio.

### 4. Cuida lo que comes

Cuando estamos estresados tiramos de azúcar, cafeína y ultraprocesados. Lo entiendo, es lo rápido. Pero eso alimenta el ciclo. Intenta incorporar más verdura, fruta y alimentos frescos. Tu microbiota intestinal te lo agradecerá.

### 5. Desconecta de verdad

No es descansar ver series con el móvil en la mano. Busca momentos de desconexión real: pasear sin auriculares, sentarte con un té mirando por la ventana, o simplemente no hacer nada durante diez minutos.

## El camino es tuyo

Reducir el estrés no es un destino, es una práctica diaria. Si sientes que necesitas una guía más personalizada, estaré encantada de acompañarte. A veces sólo hace falta que alguien mire el mapa contigo y te señale por dónde tirar.""",
    },
    {
        "title": "Brumas y sprays con aceites esenciales: guía práctica",
        "slug": "brumas-aromaterapia-aceites-esenciales",
        "category": "aromaterapia",
        "featured_image_url": "/assets/blog-aromaterapia.jpg",
        "published_at": datetime(2026, 6, 4, 10, 0, 0, tzinfo=UTC),
        "excerpt": "Hoy quiero compartir contigo una forma casera y sencilla de usar la aromaterapia en tu día a día: los sprays o brumas con aceites esenciales. Son fáciles de preparar, económicos y sorprendentemente útiles.",
        "content": """Hoy quiero compartir contigo una forma casera y sencilla de usar la aromaterapia en tu día a día: los sprays o brumas con aceites esenciales. Son fáciles de preparar, económicos y sorprendentemente útiles.

Lo que necesitas

Hazte con un vaporizador cómodo, preferiblemente opaco. Límpialo bien y deja que se seque totalmente.

Alcohol: idealmente vegetal, pero vale alcohol de 96º o vodka. Ayuda a disolver el aceite esencial, hace que el aroma dure más y al evaporarse refresca la piel. Agua mineral o filtrada: nunca del grifo. Algunos aceites esenciales pueden favorecer que la piel absorba lo que les acompaña. Además, usar agua filtrada evita envases de plástico. Aceite esencial: el protagonista.

Spray de menta: tu aliado refrescante

Una vez que conozcas este truco no vas a querer pasar un verano sin él. Es fantástico para pulverizarte cuando el calor aprieta, especialmente en las piernas.

Mi truco favorito: llevarlo a la mesilla de noche y pulverizarlo hacia arriba por encima del cuerpo para que caiga como una lluvia de menta vaporizada. Esa sensación de frescor suele durar lo suficiente para dormirte sin agobios.

También es estupendo para llevar en el bolso durante los sofocos del climaterio, aplicándolo sobre cuello y escote. Y pulverizado en el coche antes de un viaje ayuda a reducir la sensación de mareo.

Dosificación: 40 gotas por cada 100 ml, hasta 60 si te gusta intenso. No usar en bebés. Evitar en los tres primeros meses de embarazo.

Árbol del té y citronela: contra los insectos

Cuando los peques se van de campamento, el spray de árbol del té es perfecto contra los piojos: se aplica como un agua de peinado, sobre pelo seco o mojado, especialmente en el cuero cabelludo. Reduce un poco el alcohol en este caso.

También funciona para nuestros amigos perrunos: pulveriza sobre el lomo y la tripilla antes del paseo. Eso sí, nunca lo uses sobre gatos, ni lo dejes a su alcance, ya que pueden intoxicarse gravemente.

A las arañas y las garrapatas tampoco les gusta el árbol del té, así que es perfecto para paseos por el campo, sobre piel y ropa. Si quieres cubrir también mosquitos, combínalo con citronela. El geranio es opcional si en tu zona hay mosca negra (además huele muy rico).

Dosificación: sólo árbol del té, 35-40 gotas para 100 ml. Combinado antimosquitos: 35 de citronela y 15 de árbol del té. Opcionalmente 15 gotas de geranio.

Bruma de lavanda: calmando emociones

A veces los cambios de rutina tienen a la gente alterada y cuesta relajarse por la noche. Una bruma de lavanda francesa es una maravilla: vaporízala en la ropa de cama, en los pijamas, bajo la almohada…

Puedes combinarla con mandarina o naranja dulce para un toque cítrico y dulce. Aptas para adultos y niños de todas las edades.

Dosificación: lavanda sola, unas 40 gotas. Si mezclas con cítricos, no superes las 60 gotas en total para 100 ml.

Cómo se prepara

Pon en el vaporizador limpio y seco 40-60 gotas de alcohol (unos 2-3 ml). Echa las gotas del aceite esencial sobre el alcohol. Agita enérgicamente hasta que esté totalmente mezclado. Rellena con agua mineral o filtrada y vuelve a agitar. ¡Listo! Si lo guardas mucho tiempo, que no le dé el sol, y agítalo antes de usar.

Es así de fácil. Si lo pruebas, cuéntame qué tal en la sección de contacto.""",
    },
    {
        "title": "¿Qué es la naturopatía y cómo puede ayudarte?",
        "slug": "que-es-naturopatia-como-puede-ayudarte",
        "category": "Naturopatía",
        "featured_image_url": "https://naturoestela.com/wp-content/uploads/2026/03/blog-naturopatia.jpg",
        "published_at": datetime(2026, 3, 17, 10, 0, 0, tzinfo=UTC),
        "excerpt": "Si estás leyendo esto probablemente tengas curiosidad, o quizá alguien te lo haya recomendado. Voy a intentar explicarte de forma sencilla qué es esto de la naturopatía.",
        "content": """Si estás leyendo esto probablemente tengas curiosidad, o quizá alguien te lo haya recomendado. Voy a intentar explicarte de forma sencilla qué es esto de la naturopatía.

## Una forma diferente de mirar la salud

La naturopatía parte de una visión holística de la salud. Eso significa que no miramos sólo el síntoma que te molesta, sino todo el conjunto: tus hábitos, tu alimentación, cómo duermes, tu situación emocional, tu entorno… Todo influye, y todo está conectado.

A veces me gusta explicarlo con una metáfora: imagina que tu cuerpo es una orquesta. Cuando un instrumento desafina, no basta con poner el foco sólo en ese músico. Hay que mirar al director, a la partitura, al ambiente de la sala, e incluso si han dormido bien la noche anterior.

## Lo que la naturopatía NO es

- No hacemos diagnósticos. Eso es competencia médica.
- No prescribimos tratamientos ni recetamos medicación.
- No prometemos curas. Quien lo haga, desconfía.
- No sustituimos a tu médico. Nunca. Trabajamos de forma complementaria.

Lo que sí hacemos es acompañarte, asesorarte y proponerte herramientas naturales para favorecer tu bienestar.

## Cómo es una sesión conmigo

Antes de nuestra cita te pediré que rellenes un cuestionario. Durante la sesión haremos una entrevista amplia. Si tienes pruebas médicas recientes, tráelas: para mi labor de detective de la salud, todo diagnóstico médico es una pista segura.

Después me gusta explicarte mis conclusiones con calma. No será un discurso lleno de tecnicismos, sino una charla con muchas metáforas para que entiendas los procesos en los que te encuentras y el camino que podemos recorrer juntos.

## La clave: tu empoderamiento

Mi visión de la naturopatía siempre busca el empoderamiento de la persona. Yo estaré ahí para acompañarte, pero el camino lo recorres tú. No existe una pastilla mágica para todo, pero sí hay formas de hacer el camino más fácil y más ameno.

Algunas personas llaman a su cita anual conmigo «la puesta a punto». Me encanta esa forma de verlo, porque lo ideal es trabajar a nivel preventivo.

Si quieres iniciar ese camino, toma mi mano y pongámonos en marcha.""",
    },
]


import re


def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


async def _get_or_create_category(session: object, name: str) -> uuid.UUID:
    from sqlalchemy.ext.asyncio import AsyncSession

    s: AsyncSession = session  # type: ignore[assignment]
    result = await s.execute(select(CategoryModel).where(CategoryModel.name == name))
    model = result.scalar_one_or_none()
    if model:
        return model.id  # type: ignore[return-value]
    cat_id = uuid.uuid4()
    s.add(CategoryModel(id=cat_id, name=name, slug=_slugify(name)))
    await s.flush()
    return cat_id


async def seed() -> None:
    engine = create_async_engine(settings.database_url)
    session_factory = async_sessionmaker(engine, expire_on_commit=False)

    async with session_factory() as session:
        for data in POSTS:
            existing = await session.execute(
                select(PostModel).where(PostModel.slug == data["slug"])
            )
            if existing.scalar_one_or_none() is not None:
                print(f"  skip (exists): {data['slug']}")
                continue

            category_id = await _get_or_create_category(session, data["category"])

            model = PostModel(
                id=uuid.uuid4(),
                title=data["title"],
                slug=data["slug"],
                excerpt=data["excerpt"],
                content=data["content"],
                category_id=category_id,
                created_by="human",
                published_at=data["published_at"],
            )
            session.add(model)
            print(f"  insert: {data['slug']}")

        await session.commit()

    await engine.dispose()
    print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())

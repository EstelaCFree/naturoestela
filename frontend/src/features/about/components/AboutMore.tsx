import {
  Ambulance,
  Brain,
  ChevronDown,
  ChevronUp,
  Leaf,
  Microscope,
  Route,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { LogoWatermark } from "@/features/home/components/LogoWatermark";

type AccordionItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: string[];
};

const items: AccordionItem[] = [
  {
    id: "sanitaria",
    icon: <Ambulance size={20} />,
    title: "Mi juventud sanitaria",
    content: [
      "Aunque empecé estudiando periodismo, la vida y mi vocación de ayudar a la gente me llevaron a entrar de voluntaria en Cruz Roja con 17 años. A las 18 estaba subida a una ambulancia, a los 19 estaba tutelando las prácticas y con 20 ya era coordinadora del servicio sanitario en el estadio Santiago Bernabéu y otros eventos multitudinarios como festivales o conciertos.",
      "Trabajé del 2004 al 2006 como Coordinadora de Socorro y Emergencias de Madrid. Siempre será un orgullo para mi el haber participado en la coordinación de la respuesta sanitaria y psicosocial de la Cruz Roja durante la semana del 11M en Madrid.",
      "El trabajo en urgencias y emergencias me abrió el camino a una vida dedicada a los cuidados de la salud de otras personas. Aunque fue una época que recuerdo con cariño, ya entonces pululaba en mi mente el deseo de trabajar más a medio plazo con las personas. Con calma, dedicar el tiempo necesario y trabajar más en el fondo.",
      "El trabajo en la urgencia es frenético, y el tiempo que pasas con el paciente es breve. Llegas cuando el daño está hecho y tu trabajo es mantener a la persona para entregársela al siguiente eslabón de la cadena sanitaria. Anhelaba poder trabajar con las personas en los orígenes de sus dolencias, desde la prevención pero también el acompañamiento integrativo de las enfermedades cronificadas.",
    ],
  },
  {
    id: "aromaterapia",
    icon: <Sparkles size={20} />,
    title: "La aromaterapia, mi primer amor",
    content: [
      "Cuando conocí a mi Maestro, Pep Viú, yo venía del mundo sanitario y no tenía experiencia con las terapias naturales. Mi primer escepticismo enseguida se convirtió en curiosidad, y pronto en pasión cuando empecé a ver los resultados.",
      "Pep me acogió bajo su ala y me formó para que pudiera impartir cursos de su marca Gandiva a profesionales de estética, ya que él quería ir delegando en alguien. Cuando algo me enamora así no puedo parar de aprender, y Pep estaba deseoso de volcar sus conocimientos, así que fuimos un tándem perfecto.",
      "A lo largo de los años me he formado en las distintas escuelas de aromaterapia, he impartido cursos a cientos de profesionales de terapias manuales y naturales, y me he certificado internacionalmente como aromaterapéuta en West Coast Institute of Aromatherapy. Da igual lo que venga en el futuro, siempre en mi corazón habrá un lugar especial para los paseos con Pep por el Pirineo reconociendo y probando plantas medicinales, o las clases sobre aceites vegetales en una pequeña cueva en el Cabo de Creus, o el repaso a la bioquímica en Cadaqués.",
      "No puedo contar las veces que le pedí que escribiera un libro de aromaterapia para que no se perdieran sus conocimientos, y él me miraba con esos ojos intensos y riéndose decía que para eso estaba yo. Pues en ello estoy, espero que pronto ese libro sea una realidad.",
      "Por desgracia nos dejó demasiado pronto, pero siempre estará conmigo. Gracias Pep.",
    ],
  },
  {
    id: "naturopatia",
    icon: <Leaf size={20} />,
    title: "Descubriendo la naturopatía",
    content: [
      "Casi un año antes su muerte, un día cualquiera Pep me dijo que no podía enseñarme nada más. La aromaterapia me había abierto una ventana al mundo de las terapias naturales, y el apetito de conocimiento y nuevas técnicas crecía en mi. Así que cuando le dije que me estaba planteando ser Experta universitaria en Naturopatía, Pep ya lo había visto venir y me animó.",
      "Hacer esos estudios en el Real Centro Universitario Escorial María Cristina me permitió enlazar la visión naturista con la ciencia, algo que ya formaba parte de mi intereses desde mi pasado sanitario a toda la parte bioquímica de la aromaterapia. Integrar distintas visiones, como si fueran gafas con las que poder mirar a la persona que tienes delante y su situación.",
      "Fueron cuatro años que me cambiaron la vida y me abrieron un montón de nuevas ventanas por donde asomarme a nuevos campos de conocimiento. A lo largo de los años he ido incorporando técnicas como la auriculoterapia, kinesiología, fitoterapia spagírica, masaje metamórfico y marmaterapia ayurvédica. También he creado la rutina de leer uno o dos estudios o publicaciones científicas al día.",
      "En mi despacho han aparecido también herramientas, como el martillo quiropráctico o neuromuscular y el kinesiotape. No descarto nunca que aparezcan nuevas técnicas y herramientas en el futuro, ya que nunca dejaré de estudiar y aprender.",
    ],
  },
  {
    id: "tic",
    icon: <Brain size={20} />,
    title: "TIC, neurodivergencias y otras nuevas gafas",
    content: [
      "Tras atender a miles de personas, a veces acompañándolas en uno de los peores momentos en su vida a lo largo de 12 años de voluntariado y trabajo en Cruz Roja, era plenamente consciente de la importancia del apoyo psicológico durante la atención sanitaria, en la que me formé ampliamente.",
      "Cuando empecé a asesorar a las personas que acudían a mi centro de naturopatía se evidenció que el ámbito psicosocial iba a ser aún más determinante.",
      "No tengo ningún problema en recomendar a otras profesionales, tanto de terapias manuales como psicólogas en este caso. Pero es cierto que en muchos casos se trata más de acompañar el proceso, practicar la escucha activa, y trabajar de forma integrativa.",
      "Además si es necesario puedo aplicar la aromaterapia, masaje metamórfico o técnicas de apoyo psicológico como TIC (Técnicas de avanzada de Integración cerebral). Por supuesto, puedo asesorarte sobre la suplementación más adecuada a tu caso y las interacciones si tomas medicación.",
      "En los últimos años intento estar informada sobre las distintas neurodivergencias con el fin de que mis sesiones sean un espacio seguro y adaptado para personas con TDAH, autismo, etc.",
    ],
  },
  {
    id: "microbiota",
    icon: <Microscope size={20} />,
    title: "La microbiota, una pasión",
    content: [
      "Ya durante mis estudios de naturopatía hace tantos años me enamoré del invisible universo de la microbiología. En mi libro ahondo en cómo esto enlaza perfectamente con mi amor por la aromaterapia, pero entronca además de lleno con mi lado científico.",
      "Años de estudios y la experiencia asesorando a clientes con afecciones digestivas o de origen digestivo me llevaron a la divulgación y la docencia. He impartido diversos talleres para profesionales, pero dos ocasiones fueron especiales en distintos sentidos.",
      "Impartí varios seminarios del curso de Experto en Nutrición Simbiótica para profesionales del Instituto de Microbiótica. Además participé en la redacción de los libros de texto en cuanto a microbioma, patología digestiva, fisiología, atención a afecciones digestivas desde la visión naturopática y aromaterapia aplicada.",
      "En cuanto a ponencias para público general, probablemente la que recuerdo de forma especial fue en el festival Rototom en Benicassim. Este evento, por el que pasan cada año cientos de miles de personas, tiene actividades formativas y mesas redondas temáticas. Me contrataron para una ponencia sobre la microbiota, y dado que ese año la temática global era África, añadí una parte sobre alimentos fermentados tradicionales del continente africano. El ambiente intercultural, la acogida de la ponencia, la calidad de los compañeros ponentes y la cantidad de gente a la que llegó hicieron que fuese una experiencia maravillosa.",
      "Es difícil decir que tienes una especialidad cuando practicas técnicas tan integrativas, pero si tengo una, desde luego es el microbioma humano y el trabajo en digestivo desde las terapias naturales. Es desde luego una especialidad en la que cuesta muchísimo estar al día, dado el volumen de publicaciones, y quizá eso hace que la gente demande muchísimo este servicio de asesoramiento y acompañamiento.",
      "Además, puedo ofrecer la posibilidad de hacer diversas pruebas de laboratorio si fuesen necesarios, con un descuento respecto al precio normal de compra.",
      "Las recomendaciones de mis clientes han sido mi único reclamo hasta ahora en este ámbito, algo que me hace sentir muy orgullosa.",
    ],
  },
  {
    id: "cancer",
    icon: <Route size={20} />,
    title: "El camino del cáncer",
    content: [
      "En mi carrera he acompañado a muchísimas personas durante sus tratamientos oncológicos de forma siempre complementaria.",
      "Ayudaba a esas personas a entender el proceso y los informes, algo que proporciona consuelo a mucha gente. Asesoraba en materia de dieta, que es vital y que tiene que adaptarse completamente no sólo a la persona sino a su estado, al tratamiento e incluso al tipo de cáncer que sufre. Por supuesto el asesoramiento sobre suplementación compatible con los tratamientos es importante, ya que multitud de suplementos naturales son incompatibles con la quimio o inmunoterapia, o tienen que usarse en momentos concretos del ciclo para que no molesten al funcionamiento de los medicamentos. Además dependiendo de la situación las personas pueden necesitar otras herramientas, como ejercicios concretos, meditaciones, adaptaciones del entorno, etc.",
      "Y todo este acompañamiento ha de ser dinámico. Tiene que estar en continua adaptación respetando siempre el tratamiento médico y no al revés. El objetivo es mejorar la calidad de vida, mitigar los efectos secundarios y secuelas y acompañar a la persona durante el camino. Requiere una especialización y continua actualización de conocimientos, y un respeto por la ciencia y los tratamientos convencionales a los que hay que apoyar.",
      "En 2024 fui diagnosticada de cáncer y he dedicado un año y medio a hacer este camino en primera persona, después de haberlo vivido incontables veces con familiares y clientes. Espero que esta perspectiva personal me ayude a mejorar aún más mi trabajo en este campo.",
    ],
  },
  {
    id: "espacio",
    icon: <Shield size={20} />,
    title: "Crear un espacio seguro",
    content: [
      "Una de las herramientas más importantes en mi práctica es la escucha activa y la confianza.",
      "Tanto en las sesiones presenciales como online, es fundamental que mediante una entrevista concienzuda me pueda hacer una imagen general pero muy detallada de lo que está pasando en el organismo y vida de la persona que me visita. Esta es la razón de que sobre todo nuestros primeros encuentros se alarguen un poco más. Para conseguir una buena información en este sentido no sólo hay que preguntar y escuchar, también hay que generar la confianza suficiente para que la respuesta sea libre y sincera.",
      "Por supuesto todos los datos e información que se intercambia en las sesiones son confidenciales, pero más allá de eso, creo que esa confianza se genera con respeto y garantizando un espacio seguro. Sea cual sea tu realidad, en mis sesiones no va a ser recibida con prejuicios, sino con ganas de entenderte, de acogerte, y de ayudarte si está en mi mano.",
      "En los últimos años por ejemplo he intentado ampliar mis conocimientos respecto a las distintas neurodivergencias, con el fin de adaptar mi práctica a sus necesidades, así como acompañar el proceso de personas con diagnósticos tardíos.",
      "Si eres neurodivergente y tienes alguna necesidad o trigger que quieres comunicarme, hay un espacio para ello cuando solicitas la cita. Por ejemplo, puedo programar múltiples avisos y notificaciones si lo necesitas, reducir brillos, luces o aromas (en las sesiones presenciales), o cualquier otra adaptación que esté en mi mano. Siempre encontrarás respeto y comprensión con tu individualidad.",
      "Es una pena que me parezca necesario aclarar que mi espacio es seguro para personas de cualquier raza, etnia, religión, identidad de género o preferencia sexual. Ojalá vivir en un mundo en el que no hiciera falta decirlo.",
    ],
  },
];

export function AboutMore() {
  const [openId, setOpenId] = useState<string>("espacio");

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? "" : id));

  return (
    <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
      <LogoWatermark side="right" top="25%" size={800} opacity={0.04} />
      <LogoWatermark
        side="left"
        top="45%"
        size={800}
        opacity={0.04}
        rotation={45}
      />
      <div className="mx-auto max-w-4xl px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-lavender-elegant mb-3">
            Mi historia
          </p>
          <h2 className="font-serif font-light text-4xl lg:text-[44px] text-foreground text-center">
            Un poco más sobre mí
          </h2>
        </div>

        <div className="space-y-4">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-warm-ivory border border-[rgba(160,154,194,0.15)] rounded-sm overflow-hidden"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`accordion-${item.id}`}
                  onClick={() => toggle(item.id)}
                  className={`w-full flex items-center justify-between px-8 py-6 transition-colors ${
                    isOpen ? "bg-[rgba(160,154,194,0.07)]" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-lavender-elegant rounded-full size-10 flex items-center justify-center text-white shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-medium text-lavender-elegant text-[1.05rem] text-left">
                      {item.title}
                    </span>
                  </div>
                  <div className="bg-lavender-elegant/15 rounded-full size-8 flex items-center justify-center shrink-0 ml-4">
                    {isOpen ? (
                      <ChevronUp size={16} className="text-lavender-elegant" />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-lavender-elegant"
                      />
                    )}
                  </div>
                </button>

                {isOpen && item.content.length > 0 && (
                  <div
                    id={`accordion-${item.id}`}
                    className="pt-5 px-8 pb-8 pl-[80px] pr-8 space-y-4"
                  >
                    {item.content.map((paragraph, i) => (
                      <p
                        key={i}
                        className="text-taupe text-[0.97rem] leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

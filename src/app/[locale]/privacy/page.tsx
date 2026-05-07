import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default async function Privacy({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const isEs = params.locale === "es";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">
        {isEs ? "Política de Privacidad" : "Privacy Policy"}
      </h1>
      <div className="prose prose-navy prose-lg max-w-none">
        <p className="text-sm text-gray-500">
          {isEs ? "Última actualización: 7 de mayo de 2026" : "Last updated: May 7, 2026"}
        </p>

        <h2>{isEs ? "Quiénes somos" : "Who We Are"}</h2>
        <p>
          {isEs
            ? "MVA Compensation (\"nosotros\") opera el sitio web mvacompensation.com. No somos un bufete de abogados. Somos un servicio de referencia que conecta a personas que han sufrido accidentes de vehículos motorizados con abogados con licencia en su estado."
            : "MVA Compensation (\"we\", \"us\") operates mvacompensation.com. We are not a law firm. We are a referral service that connects individuals who have been in motor vehicle accidents with licensed attorneys in their state."}
        </p>

        <h2>{isEs ? "Información que recopilamos" : "Information We Collect"}</h2>
        <p>
          {isEs
            ? "Cuando usas nuestro formulario de evaluación de caso, recopilamos:"
            : "When you use our case evaluation form, we collect:"}
        </p>
        <ul>
          <li>{isEs ? "Nombre y apellido" : "First and last name"}</li>
          <li>{isEs ? "Número de teléfono" : "Phone number"}</li>
          <li>{isEs ? "Dirección de correo electrónico" : "Email address"}</li>
          <li>{isEs ? "Estado donde ocurrió el accidente" : "State where the accident occurred"}</li>
          <li>{isEs ? "Detalles del accidente (cuándo ocurrió, si hubo lesiones)" : "Accident details (when it occurred, whether injuries were sustained)"}</li>
          <li>{isEs ? "Dirección IP" : "IP address"}</li>
          <li>{isEs ? "Información del navegador (user agent)" : "Browser information (user agent)"}</li>
        </ul>
        <p>
          {isEs
            ? "También recopilamos automáticamente datos de uso a través de cookies y tecnologías similares, incluyendo páginas visitadas, fuente de referencia y parámetros UTM."
            : "We also automatically collect usage data through cookies and similar technologies, including pages visited, referral source, and UTM parameters."}
        </p>

        <h2>{isEs ? "Cómo usamos tu información" : "How We Use Your Information"}</h2>
        <ul>
          <li>{isEs ? "Para conectarte con abogados con licencia en tu estado" : "To connect you with licensed attorneys in your state"}</li>
          <li>{isEs ? "Para verificar tu número de teléfono por mensaje de texto (SMS)" : "To verify your phone number via text message (SMS)"}</li>
          <li>{isEs ? "Para comunicarnos contigo sobre tu caso" : "To communicate with you about your case"}</li>
          <li>{isEs ? "Para mejorar nuestro sitio web y servicios" : "To improve our website and services"}</li>
          <li>{isEs ? "Para cumplir con obligaciones legales" : "To comply with legal obligations"}</li>
        </ul>

        <h2>{isEs ? "Con quién compartimos tu información" : "Who We Share Your Information With"}</h2>
        <p>
          {isEs
            ? "Compartimos tu información con abogados y bufetes de abogados con licencia que pueden ayudarte con tu caso. Estos abogados son terceros independientes que operan bajo sus propias políticas de privacidad. Al enviar tu información a través de nuestro formulario, autorizas esta transferencia."
            : "We share your information with licensed attorneys and law firms who may be able to help with your case. These attorneys are independent third parties operating under their own privacy policies. By submitting your information through our form, you authorize this transfer."}
        </p>
        <p>
          {isEs
            ? "También podemos compartir tu información con proveedores de servicios que nos ayudan a operar nuestro negocio, incluyendo:"
            : "We may also share your information with service providers that help us operate our business, including:"}
        </p>
        <ul>
          <li>{isEs ? "Twilio (verificación de teléfono por SMS)" : "Twilio (SMS phone verification)"}</li>
          <li>{isEs ? "TrustedForm (certificación de consentimiento)" : "TrustedForm (consent certification)"}</li>
          <li>{isEs ? "Google Analytics (análisis de sitio web)" : "Google Analytics (website analytics)"}</li>
          <li>{isEs ? "GoHighLevel (gestión de contactos)" : "GoHighLevel (contact management)"}</li>
        </ul>

        <h2>{isEs ? "Consentimiento TCPA" : "TCPA Consent"}</h2>
        <p>
          {isEs
            ? "Al enviar nuestro formulario de evaluación de caso, das tu consentimiento expreso por escrito para que MVA Compensation y sus socios legales se comuniquen contigo por teléfono, mensaje de texto (SMS) y correo electrónico al número de teléfono y dirección de correo que proporcionaste, incluyendo mediante tecnología automatizada, sobre tu posible caso legal. Este consentimiento no es una condición para recibir ningún servicio. Pueden aplicar cargos por mensajes y datos."
            : "By submitting our case evaluation form, you provide express written consent for MVA Compensation and its legal partners to contact you by phone, text message (SMS), and email at the phone number and email address you provided, including via automated technology, regarding your potential legal case. This consent is not a condition of receiving any service. Message and data rates may apply."}
        </p>

        <h2>{isEs ? "Cookies y seguimiento" : "Cookies and Tracking"}</h2>
        <p>
          {isEs
            ? "Usamos cookies y tecnologías similares para analizar el tráfico del sitio y mejorar tu experiencia. Esto incluye Google Analytics y Meta Pixel. Puedes desactivar las cookies en la configuración de tu navegador, aunque algunas funciones del sitio pueden no funcionar correctamente."
            : "We use cookies and similar technologies to analyze site traffic and improve your experience. This includes Google Analytics and Meta Pixel. You can disable cookies in your browser settings, though some site features may not function properly."}
        </p>

        <h2>{isEs ? "Tus derechos" : "Your Rights"}</h2>
        <p>
          {isEs
            ? "Puedes solicitar acceso, corrección o eliminación de tu información personal contactándonos. Si recibiste mensajes de texto y deseas dejar de recibirlos, responde STOP a cualquier mensaje."
            : "You may request access to, correction of, or deletion of your personal information by contacting us. If you received text messages and wish to opt out, reply STOP to any message."}
        </p>

        <h2>{isEs ? "Seguridad de datos" : "Data Security"}</h2>
        <p>
          {isEs
            ? "Usamos medidas de seguridad estándar de la industria para proteger tu información personal. Sin embargo, ninguna transmisión por internet es 100% segura y no podemos garantizar seguridad absoluta."
            : "We use industry-standard security measures to protect your personal information. However, no internet transmission is 100% secure and we cannot guarantee absolute security."}
        </p>

        <h2>{isEs ? "Contacto" : "Contact"}</h2>
        <p>
          {isEs
            ? "Si tienes preguntas sobre esta política de privacidad, contáctanos en: privacy@mvacompensation.com"
            : "If you have questions about this privacy policy, contact us at: privacy@mvacompensation.com"}
        </p>
      </div>
    </div>
  );
}

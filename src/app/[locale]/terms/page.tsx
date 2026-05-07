import type { Locale } from "@/lib/i18n";

export default async function Terms({
  params,
}: {
  params: { locale: Locale };
}) {
  const isEs = params.locale === "es";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">
        {isEs ? "Términos de Uso" : "Terms of Use"}
      </h1>
      <div className="prose prose-navy prose-lg max-w-none">
        <p className="text-sm text-gray-500">
          {isEs ? "Última actualización: 7 de mayo de 2026" : "Last updated: May 7, 2026"}
        </p>

        <h2>{isEs ? "Aceptación de los términos" : "Acceptance of Terms"}</h2>
        <p>
          {isEs
            ? "Al acceder y usar mvacompensation.com, aceptas estos términos de uso. Si no estás de acuerdo, no uses este sitio."
            : "By accessing and using mvacompensation.com, you agree to these terms of use. If you do not agree, do not use this site."}
        </p>

        <h2>{isEs ? "No somos un bufete de abogados" : "We Are Not a Law Firm"}</h2>
        <p>
          {isEs
            ? "MVA Compensation NO es un bufete de abogados y no proporciona asesoramiento legal. Somos un servicio de referencia que conecta a personas que han sufrido accidentes de vehículos motorizados con abogados independientes con licencia. Cualquier abogado con el que te conectemos es un profesional independiente y no un empleado o agente de MVA Compensation."
            : "MVA Compensation is NOT a law firm and does not provide legal advice. We are a referral service that connects individuals who have been in motor vehicle accidents with independent licensed attorneys. Any attorney we connect you with is an independent professional and not an employee or agent of MVA Compensation."}
        </p>

        <h2>{isEs ? "Información general, no asesoramiento legal" : "General Information, Not Legal Advice"}</h2>
        <p>
          {isEs
            ? "El contenido de este sitio web es solo para fines informativos y educativos. No constituye asesoramiento legal y no debe ser tratado como tal. Cada caso es diferente y los resultados varían. Las cifras de compensación mencionadas en nuestras guías son estimaciones basadas en datos públicos y no garantizan resultados específicos."
            : "The content on this website is for informational and educational purposes only. It does not constitute legal advice and should not be treated as such. Every case is different and results vary. Compensation figures mentioned in our guides are estimates based on public data and do not guarantee specific outcomes."}
        </p>

        <h2>{isEs ? "Servicio de evaluación de caso" : "Case Evaluation Service"}</h2>
        <p>
          {isEs
            ? "Nuestro formulario de evaluación de caso recopila información básica sobre tu accidente para conectarte con un abogado apropiado. Al enviar el formulario, autorizas a MVA Compensation a compartir tu información con abogados con licencia que pueden ayudarte. No se crea ninguna relación abogado-cliente al enviar este formulario."
            : "Our case evaluation form collects basic information about your accident to connect you with an appropriate attorney. By submitting the form, you authorize MVA Compensation to share your information with licensed attorneys who may be able to help. No attorney-client relationship is created by submitting this form."}
        </p>

        <h2>{isEs ? "Sin garantía de resultados" : "No Guarantee of Results"}</h2>
        <p>
          {isEs
            ? "No garantizamos que recibirás compensación, que serás conectado con un abogado, ni ningún resultado específico. Los resultados legales dependen de los hechos de cada caso individual."
            : "We do not guarantee that you will receive compensation, that you will be connected with an attorney, or any specific outcome. Legal outcomes depend on the facts of each individual case."}
        </p>

        <h2>{isEs ? "Contenido de terceros" : "Third-Party Content"}</h2>
        <p>
          {isEs
            ? "Este sitio puede contener enlaces a sitios web de terceros. No somos responsables del contenido, políticas de privacidad o prácticas de sitios de terceros."
            : "This site may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of third-party sites."}
        </p>

        <h2>{isEs ? "Limitación de responsabilidad" : "Limitation of Liability"}</h2>
        <p>
          {isEs
            ? "MVA Compensation no será responsable de ningún daño directo, indirecto, incidental o consecuente que surja del uso de este sitio web o la incapacidad de usarlo, incluyendo pero no limitado a la confianza en la información proporcionada."
            : "MVA Compensation shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or inability to use it, including but not limited to reliance on information provided."}
        </p>

        <h2>{isEs ? "Cambios a estos términos" : "Changes to These Terms"}</h2>
        <p>
          {isEs
            ? "Podemos actualizar estos términos en cualquier momento. Los cambios entran en vigor al publicarse en esta página. El uso continuado del sitio después de los cambios constituye aceptación de los nuevos términos."
            : "We may update these terms at any time. Changes take effect when posted on this page. Continued use of the site after changes constitutes acceptance of the new terms."}
        </p>

        <h2>{isEs ? "Contacto" : "Contact"}</h2>
        <p>
          {isEs
            ? "Si tienes preguntas sobre estos términos, contáctanos en: legal@mvacompensation.com"
            : "If you have questions about these terms, contact us at: legal@mvacompensation.com"}
        </p>
      </div>
    </div>
  );
}

---
title: PseudoAI Privacyverklaring
language: nl
effectiveDate: 2026-09-05
effectiveDateLabel: "Ingangsdatum: 5 september 2026"
---

# PseudoAI Privacyverklaring

**Ingangsdatum: 5 september 2026**

Deze Privacyverklaring legt uit hoe PseudoAI persoonsgegevens verwerkt wanneer u PseudoAI gebruikt, waaronder de PseudoAI-plugin voor ChatGPT en Codex, de gebruikersinterface, gerelateerde MCP-diensten en bijbehorende PseudoAI-diensten (gezamenlijk de "Dienst").

De Dienst wordt aangeboden door **Dutchhamburgers**, handelend onder de naam PseudoAI ("PseudoAI", "wij", "ons" of "onze"), gevestigd aan **Vierbanse Gantel 21, Tilburg**, Nederland, KvK-nummer **42032983**.

PseudoAI is ontworpen vanuit het principe van dataminimalisatie. Het doel is gebruikers te helpen persoonlijke, vertrouwelijke of anderszins gevoelige informatie te herkennen en te beperken voordat informatie bewust met een externe AI-dienst wordt gedeeld.

## 1. Hoe PseudoAI werkt

Afhankelijk van de configuratie die uw organisatie heeft ingesteld, kan PseudoAI tekst en documenten analyseren, mogelijk gevoelige informatie herkennen, deze informatie ter beoordeling aanbieden en geselecteerde informatie vervangen door tokens, pseudoniemen of andere geminimaliseerde representaties.

PseudoAI is zo ontworpen dat oorspronkelijke informatie kan worden verwerkt binnen een beveiligde omgeving die onder controle staat van de organisatie van de gebruiker.

In de standaardimplementatie onder beheer van de organisatie blijven documenten, prompts, oorspronkelijke waarden en andere informatie die voor detectie en pseudonimisering wordt verwerkt binnen de PseudoAI-omgeving van de organisatie. Dat is alleen anders wanneer de gebruiker of organisatie uitdrukkelijk besluit informatie naar een externe dienst te verzenden.

Voor de normale detectie- en pseudonimiseringsfuncties vereist PseudoAI niet dat oorspronkelijke gevoelige informatie aan ons als softwareleverancier wordt verstrekt.

## 2. De grens tussen PseudoAI en ChatGPT

PseudoAI en ChatGPT/OpenAI zijn afzonderlijke verwerkingsomgevingen.

PseudoAI is bedoeld om de hoeveelheid informatie die beschikbaar wordt gesteld aan een externe AI-dienst te beperken. Oorspronkelijke waarden die door PseudoAI worden vervangen, behoren binnen de beveiligde PseudoAI-omgeving te blijven. Alleen de voor verzending goedgekeurde geminimaliseerde of gepseudonimiseerde informatie wordt beschikbaar gesteld aan ChatGPT of een andere geselecteerde AI-dienst.

Wanneer pseudonimisering wordt toegepast, wordt de informatie die nodig is om een token aan de oorspronkelijke waarde te koppelen bewaard binnen de toepasselijke beveiligde PseudoAI-omgeving en onder controle van de betreffende organisatie.

De openbare PseudoAI-plugin en de MCP-interface zijn niet bedoeld om ChatGPT te gebruiken als transportmechanisme voor oorspronkelijke, niet-geminimaliseerde gevoelige informatie.

Gebruikers dienen de voor verzending aangeboden informatie te beoordelen voordat zij toestemming geven om deze naar ChatGPT of een andere externe AI-dienst te verzenden.

## 3. Persoonsgegevens die kunnen worden verwerkt

Welke categorieën gegevens worden verwerkt, hangt af van de configuratie en het gebruik van PseudoAI.

### 3.1 Door de gebruiker geselecteerde inhoud

Een gebruiker kan ervoor kiezen tekst, documenten of andere inhoud met PseudoAI te verwerken. Deze inhoud kan namen, contactgegevens, organisatiespecifieke informatie, dossierinformatie, financiële informatie of andere informatie bevatten die de organisatie als vertrouwelijk of gevoelig beschouwt.

Deze inhoud wordt verwerkt met het doel informatie te detecteren, classificeren, markeren, maskeren of pseudonimiseren.

In de standaardimplementatie onder beheer van de organisatie vindt deze verwerking plaats binnen de PseudoAI-omgeving van de organisatie.

### 3.2 Pseudoniemen en tokens

PseudoAI kan geselecteerde informatie vervangen door tokens of pseudoniemen.

Een token is op zichzelf bedoeld om de oorspronkelijke waarde niet prijs te geven. Een token kan echter met behulp van afzonderlijk bewaarde koppelingsinformatie weer aan een persoon worden gekoppeld. In dat geval kan het token onder toepasselijke gegevensbeschermingswetgeving nog steeds een persoonsgegeven vormen.

Tokenkoppelingen worden gescheiden gehouden van de informatie die naar een externe AI-dienst wordt verzonden.

### 3.3 Account- en authenticatiegegevens

Wanneer authenticatie is ingeschakeld, kan PseudoAI beperkte accountgegevens verwerken die nodig zijn om geautoriseerde toegang tot de Dienst te bieden. Dit kan onder meer een gebruikers-ID, organisatie-ID, rol of toegangsrecht en authenticatiegerelateerde technische informatie omvatten.

Authenticatiegeheimen zoals wachtwoorden, API-sleutels, MFA-codes of eenmalige wachtwoorden mogen niet worden opgenomen in tekst of documenten die via PseudoAI naar externe AI-diensten worden verzonden.

### 3.4 Operationele en auditinformatie

Wanneer de organisatie dit heeft ingeschakeld, kan PseudoAI operationele of auditinformatie genereren die nodig is voor beveiliging, beheer en verantwoording.

PseudoAI is ontworpen om dergelijke informatie te minimaliseren. Auditinformatie behoort geen documentinhoud of oorspronkelijke gevoelige waarden te bevatten, tenzij dit uitdrukkelijk is geconfigureerd en noodzakelijk is.

### 3.5 Ondersteuningsinformatie

PseudoAI ontvangt bij de standaardwerking van de Dienst geen klantdocumenten, prompts of datasets.

Als een organisatie ondersteuning of onderhoud verzoekt waarvoor toegang tot persoonsgegevens nodig is, vindt die toegang uitsluitend plaats voor het specifieke ondersteuningsdoel, gedurende een beperkte periode en met passende beveiligings- en geheimhoudingsmaatregelen.

## 4. Beperkte en zeer gevoelige informatie

De PseudoAI-plugin is ontworpen om onnodige bekendmaking van gevoelige informatie aan externe AI-diensten te helpen voorkomen.

De PseudoAI MCP-interface is niet bedoeld om betaalkaartgegevens, beschermde gezondheidsgegevens, door de overheid uitgegeven identificatienummers, wachtwoorden, API-sleutels, authenticatiegeheimen, MFA-codes of eenmalige wachtwoorden te verzamelen of op te vragen.

Dergelijke informatie mag niet bewust als invoer aan de plugin of MCP-interface worden verstrekt.

Een organisatie kan dergelijke informatie binnen haar eigen beveiligde PseudoAI-omgeving verwerken met het doel deze te herkennen en te verwijderen voordat externe verzending plaatsvindt. De oorspronkelijke informatie behoort dan binnen die beheerde omgeving te blijven en mag niet via de PseudoAI MCP-interface naar ChatGPT of een andere externe AI-aanbieder worden verzonden.

## 5. Doeleinden van de verwerking

PseudoAI verwerkt informatie alleen voor zover dit noodzakelijk is voor doeleinden die verband houden met het leveren en beveiligen van de Dienst. Deze doeleinden omvatten:

- het detecteren van mogelijk gevoelige informatie;
- het classificeren van informatie volgens geconfigureerd beleid;
- het ter beoordeling aan gebruikers aanbieden van informatie;
- het maskeren of pseudonimiseren van geselecteerde informatie;
- het waar van toepassing mogelijk maken van heridentificatie binnen de beveiligde omgeving;
- het authenticeren van geautoriseerde gebruikers;
- het handhaven van beveiligings- en toegangscontroles;
- het genereren van passend geminimaliseerde auditinformatie;
- het bieden van ondersteuning op verzoek van de organisatie;
- het voldoen aan toepasselijke wettelijke verplichtingen.

PseudoAI bepaalt niet welke documenten een organisatie verwerkt, waarom die documenten worden verwerkt of welke externe AI-diensten een organisatie kiest te gebruiken.

## 6. Controle door de gebruiker

PseudoAI is ontworpen om gebruikers controle te geven over informatie voordat deze bewust naar een externe AI-dienst wordt verzonden.

Afhankelijk van de door de organisatie gekozen configuratie kunnen gebruikers:

- gedetecteerde informatie beoordelen;
- waarschuwingen beoordelen;
- classificaties wijzigen;
- maskering toevoegen of verwijderen;
- gepseudonimiseerde informatie beoordelen;
- beslissen of informatie mag worden verzonden.

PseudoAI ondersteunt gebruikers bij dataminimalisatie, maar geautomatiseerde detectie is van nature niet foutloos. PseudoAI kan niet garanderen dat elk onderdeel met persoonlijke, vertrouwelijke of gevoelige informatie wordt gedetecteerd.

Gebruikers dienen daarom een redelijke eindcontrole uit te voeren voordat zij informatie goedkeuren voor verzending naar een externe AI-dienst.

## 7. Wie ontvangt persoonsgegevens

In de standaardimplementatie onder beheer van de organisatie wordt oorspronkelijke klantinhoud verwerkt binnen de door de organisatie beheerde omgeving en niet routinematig aan PseudoAI als softwareleverancier bekendgemaakt.

Informatie kan, waar van toepassing, beschikbaar worden gesteld aan de volgende categorieën ontvangers:

**De organisatie van de gebruiker.** De organisatie beheert de PseudoAI-omgeving, gebruikerstoegang, beleid en configuratie.

**Externe AI-aanbieders.** Informatie wordt alleen aan ChatGPT/OpenAI of een andere AI-aanbieder verstrekt wanneer de toepasselijke workflow die informatie bewust verzendt. PseudoAI is ontworpen om de geminimaliseerde of gepseudonimiseerde versie te verzenden in plaats van de oorspronkelijke waarden. De verwerking door de externe AI-aanbieder wordt beheerst door de overeenkomst, accountconfiguratie en privacyvoorwaarden die op die aanbieder van toepassing zijn.

**PseudoAI-personeel.** Geautoriseerd PseudoAI-personeel kan beperkte informatie ontvangen wanneer dit noodzakelijk is voor door de klant verzochte ondersteuning, onderhoud, beveiliging of incidentrespons.

**Dienstverleners.** Wanneer PseudoAI infrastructuur of dienstverleners van derden gebruikt om onderdelen van haar eigen diensten uit te voeren, mogen deze partijen uitsluitend de informatie verwerken die nodig is om die diensten te leveren en moeten passende contractuele en beveiligingsverplichtingen gelden.

Een actuele lijst van relevante dienstverleners en subverwerkers die door PseudoAI worden gebruikt, is beschikbaar op https://pseudoai.nl/dienstverleners.

In de standaardimplementatie onder beheer van de organisatie ontvangen deze dienstverleners als onderdeel van het normale detectie- en pseudonimiseringsproces van PseudoAI geen oorspronkelijke klantdocumenten, prompts, tokenkoppelingen of heridentificatiesleutels.

## 8. OpenAI en ChatGPT

PseudoAI is een onafhankelijke dienst en wordt niet door OpenAI beheerd.

Wanneer een gebruiker bewust geminimaliseerde of gepseudonimiseerde informatie naar ChatGPT verzendt, is die informatie onderworpen aan de voorwaarden, privacypraktijken en accountconfiguratie die op de OpenAI-dienst van de gebruiker van toepassing zijn.

PseudoAI bepaalt niet hoe OpenAI informatie verwerkt nadat deze aan OpenAI is verzonden.

Gebruikers en organisaties dienen er daarom voor te zorgen dat hun gebruik van ChatGPT verenigbaar is met hun eigen vereisten op het gebied van privacy, vertrouwelijkheid en informatiebeveiliging.

## 9. Rechtsgrondslag

Wanneer PseudoAI persoonsgegevens namens een organisatie verwerkt, bepaalt de organisatie de toepasselijke rechtsgrondslag voor die verwerking. PseudoAI handelt, wanneer zij als verwerker optreedt, overeenkomstig de gedocumenteerde instructies van de organisatie.

PseudoAI kan ook zelfstandig beperkte persoonsgegevens verwerken die nodig zijn voor het beheren van de eigen klantrelatie, beveiliging, ondersteuning of wettelijke verplichtingen. Die verwerking kan, afhankelijk van de situatie, zijn gebaseerd op de uitvoering van een overeenkomst, het voldoen aan een wettelijke verplichting of de gerechtvaardigde belangen van PseudoAI bij het uitvoeren en beveiligen van de Dienst.

## 10. Gegevensverwerking en bewaartermijnen

De onderstaande tabel beschrijft hoe de belangrijkste gegevenscategorieën worden verwerkt en bewaard binnen de standaardimplementatie onder beheer van de organisatie. PseudoAI hanteert het beginsel dat persoonsgegevens niet langer mogen worden bewaard dan noodzakelijk.

| Gegevenscategorie | Verwerking en ontvangers | Bewaartermijn |
| --- | --- | --- |
| Oorspronkelijke tekst, documenten en gevoelige waarden | Geanalyseerd, geclassificeerd, gemarkeerd, gemaskeerd of gepseudonimiseerd binnen de PseudoAI-omgeving onder beheer van de organisatie. Toegankelijk voor de gebruiker en geautoriseerde personen binnen de organisatie. Niet routinematig beschikbaar voor PseudoAI als softwareleverancier; vervangen oorspronkelijke waarden worden niet naar de externe AI-aanbieder verzonden. | PseudoAI bewaart als softwareleverancier geen permanente kopie. De werkkopie bestaat alleen tijdens de actieve workflow of sessie. Een bronbestand dat door de gebruiker of organisatie wordt bewaard, blijft onder het eigen beheer en bewaarbeleid van die gebruiker of organisatie. |
| Token- of pseudoniemkoppeling en heridentificatiesleutel | Wordt uitsluitend gebruikt om oorspronkelijke waarden te vervangen en, waar ingeschakeld, te herstellen. Wordt afzonderlijk bewaard binnen de beveiligde browsersessie of door de organisatie beheerde omgeving. Wordt niet naar ChatGPT/OpenAI of een andere externe AI-aanbieder verzonden en is niet routinematig toegankelijk voor PseudoAI als softwareleverancier. | Alleen tijdens de actieve sessie. Wordt automatisch verwijderd wanneer de sessie eindigt en in alle gevallen uiterlijk 4 uur na aanmaak. |
| Geminimaliseerde of gepseudonimiseerde inhoud | Wordt aan de gebruiker getoond voor een eindcontrole en pas na goedkeuring naar de geselecteerde externe AI-aanbieder verzonden. PseudoAI verwerkt deze inhoud tijdelijk om de goedgekeurde workflow te voltooien. | Wordt na de actieve workflow of sessie niet door PseudoAI bewaard. De geselecteerde externe AI-aanbieder bewaart de inhoud volgens de voorwaarden, accountinstellingen en overeenkomst van de organisatie die op die aanbieder van toepassing zijn. |
| Door AI gegenereerd antwoord | Wordt door de geselecteerde externe AI-aanbieder gegenereerd, aan de gebruiker teruggestuurd en, waar ingeschakeld, alleen binnen de beveiligde PseudoAI-sessie geheridentificeerd. | Wordt na de sessie niet door PseudoAI bewaard. Eventuele bewaring door de externe AI-aanbieder wordt beheerst door de voorwaarden en accountinstellingen van die aanbieder. |
| Operationele en auditgegevens | Geminimaliseerde gebeurtenisgegevens die worden gebruikt voor beveiliging, beheer en verantwoording, zoals type gebeurtenis, tijdstip en uitkomst. Auditgegevens zijn zo ontworpen dat zij geen documentinhoud, prompts, oorspronkelijke waarden, tokenkoppelingen of directe identificatie van eindgebruikers bevatten. Toegang is beperkt tot geautoriseerde beheerders of auditors en, wanneer ondersteuning wordt gevraagd, geautoriseerd PseudoAI-personeel. | 90 dagen, waarna de gegevens automatisch worden verwijderd. De organisatie kan een kortere termijn configureren. |
| Account- en authenticatiegegevens | Beperkte identificatoren, organisatielidmaatschap, rol of toegangsrecht en authenticatiegerelateerde technische informatie die worden gebruikt om toegang te beheren. Wachtwoorden, API-sleutels, MFA-codes en eenmalige wachtwoorden worden niet als Gebruikersinhoud opgeslagen. | Voor de duur van het actieve account of toegangsrecht. Het account wordt verwijderd of gedeactiveerd wanneer de toegang eindigt. Gerelateerde auditgebeurtenissen vervallen volgens de bewaartermijn van 90 dagen voor auditgegevens. |
| Ondersteunings- en onderhoudsgegevens | Worden alleen verwerkt wanneer de organisatie ondersteuning of onderhoud verzoekt waarvoor toegang nodig is. Toegang is beperkt tot geautoriseerd PseudoAI-personeel, een specifiek doel en de periode die nodig is om de werkzaamheden uit te voeren. | De toegang eindigt wanneer de werkzaamheden zijn afgerond. Persoonsgegevens die voor de werkzaamheden zijn ontvangen, worden vervolgens zonder onredelijke vertraging verwijderd of geretourneerd, tenzij tijdelijke verdere bewaring wettelijk vereist is. |
| Contractuele en administratieve gegevens | Contact-, contract-, facturatie- en gerelateerde administratieve gegevens van klanten die door PseudoAI worden verwerkt voor klantbeheer, naleving van wettelijke verplichtingen, beveiliging en geschilbeslechting. Alleen verstrekt aan geautoriseerd personeel, noodzakelijke dienstverleners of bevoegde autoriteiten wanneer dit wettelijk vereist is. | Gedurende de klantrelatie en daarna uitsluitend gedurende de wettelijke boekhoudkundige of verjaringstermijn die op het specifieke gegeven van toepassing is. |

Een organisatie kan kortere bewaartermijnen configureren. Een afwijkende of langere termijn geldt alleen wanneer dit wettelijk vereist is of uitdrukkelijk is vastgelegd in een schriftelijke overeenkomst met de organisatie. Wanneer een dergelijke overeenkomst strijdig is met deze Privacyverklaring voor verwerking namens die organisatie, prevaleert de afzonderlijk overeengekomen verwerkingsregeling.

## 11. Beveiliging

PseudoAI is ontworpen om passende technische en organisatorische beveiligingsmaatregelen te ondersteunen. Afhankelijk van de implementatie kunnen deze maatregelen onder meer omvatten:

- versleuteling tijdens transport;
- rolgebaseerde toegangscontrole;
- toegangsbeheer;
- logging;
- monitoring;
- beheer van secrets;
- patchbeheer;
- kwetsbaarheidsbeheer;
- incidentresponsprocedures;
- auditmogelijkheden.

Toegang door PseudoAI-personeel tot persoonsgegevens binnen een klantomgeving maakt geen deel uit van de normale werking van de Dienst. Wanneer die toegang bij uitzondering nodig is voor ondersteuning, is deze beperkt tot geautoriseerd personeel dat aan geheimhoudingsverplichtingen is gebonden.

Geen enkele technische of organisatorische maatregel kan absolute beveiliging bieden.

## 12. Internationale doorgiften

In de standaardimplementatie onder beheer van de organisatie bepaalt de organisatie waar haar PseudoAI-omgeving en de daarin verwerkte informatie worden gehost.

PseudoAI draagt oorspronkelijke klantinhoud als onderdeel van de normale detectie en pseudonimisering niet bewust over buiten die omgeving.

Wanneer informatie bewust naar een externe AI-aanbieder wordt verzonden, worden de geografische locatie en rechtsgrondslag voor verwerking of internationale doorgifte door die aanbieder beheerst door de afspraken van de klant met die aanbieder.

Wanneer PseudoAI zelf persoonsgegevens buiten de Europese Economische Ruimte overdraagt, gebruikt PseudoAI waar wettelijk vereist een toepasselijk rechtmatig doorgiftemechanisme en passende waarborgen.

## 13. Rollen inzake gegevensbescherming en contractuele afspraken

Voor persoonsgegevens in documenten, prompts of andere klantinhoud bepaalt de organisatie die PseudoAI gebruikt in het algemeen de doeleinden en middelen van de verwerking en treedt zij op als verwerkingsverantwoordelijke.

PseudoAI levert software die de verwerkingsactiviteiten van de organisatie ondersteunt.

Wanneer PseudoAI op verzoek van de organisatie voor ondersteunings- of onderhoudsdoeleinden toegang krijgt tot persoonsgegevens en die informatie namens de organisatie verwerkt, treedt PseudoAI voor die activiteiten op als verwerker in de zin van artikel 28 AVG.

Wanneer een organisatie met PseudoAI een PseudoAI Privacy- en gegevensverwerkingsaddendum, verwerkersovereenkomst of andere schriftelijke verwerkingsregeling heeft gesloten, bevat die overeenkomst aanvullende voorwaarden voor de verwerking van persoonsgegevens namens die organisatie.

Wanneer een dergelijke overeenkomst strijdig is met deze Privacyverklaring voor zover het verwerking namens de organisatie betreft, prevaleert de afzonderlijk overeengekomen verwerkingsregeling voor zover sprake is van die strijdigheid.

## 14. Uw privacyrechten

Afhankelijk van de toepasselijke gegevensbeschermingswetgeving kunnen personen onder meer recht hebben op inzage in hun persoonsgegevens, rectificatie van onjuiste informatie, gegevenswissing, beperking van de verwerking, bezwaar tegen bepaalde verwerkingen en gegevensoverdraagbaarheid.

Wanneer persoonsgegevens worden verwerkt door een organisatie die PseudoAI gebruikt, moeten verzoeken met betrekking tot die gegevens normaliter worden gericht aan die organisatie als verwerkingsverantwoordelijke.

Wanneer PseudoAI voor de betreffende persoonsgegevens als verwerkingsverantwoordelijke optreedt, kunnen verzoeken worden ingediend via privacy@pseudoai.nl.

Wij kunnen uw identiteit moeten verifiëren voordat wij op een verzoek reageren.

Personen in de Europese Economische Ruimte hebben daarnaast het recht een klacht in te dienen bij hun bevoegde toezichthoudende autoriteit. In Nederland is dit de Autoriteit Persoonsgegevens.

## 15. Beveiligingsincidenten

Wanneer PseudoAI kennis krijgt van een inbreuk in verband met persoonsgegevens die PseudoAI namens een organisatie verwerkt, stelt PseudoAI de betreffende organisatie zonder onredelijke vertraging op de hoogte overeenkomstig de toepasselijke contractuele en wettelijke verplichtingen.

De organisatie blijft, wanneer zij als verwerkingsverantwoordelijke optreedt, verantwoordelijk voor het bepalen of melding aan een toezichthoudende autoriteit of betrokken personen vereist is.

## 16. Kinderen

PseudoAI is primair ontworpen voor professioneel en organisatorisch gebruik en is niet specifiek op kinderen gericht.

Organisaties die PseudoAI gebruiken zijn verantwoordelijk voor het bepalen of het beoogde gebruik waarbij minderjarigen betrokken zijn rechtmatig en passend is.

## 17. Websiteanalyse en cookies

Deze Privacyverklaring heeft primair betrekking op de PseudoAI-dienst en plugin.

De PseudoAI-website kan strikt noodzakelijke technische functionaliteit gebruiken en, waar van toepassing, analytics of cookies zoals beschreven op de afzonderlijke pagina https://pseudoai.nl/cookiebeleid.

Informatie die via de PseudoAI-plugin wordt verkregen, wordt niet gebruikt voor advertenties of gedragsprofilering, tenzij dit afzonderlijk en uitdrukkelijk wordt bekendgemaakt en daarvoor een rechtsgrondslag bestaat.

## 18. Wijzigingen in deze Privacyverklaring

Wij kunnen deze Privacyverklaring bijwerken om wijzigingen in de Dienst, onze verwerkingsactiviteiten, toepasselijke wet- en regelgeving of wettelijke vereisten weer te geven.

De actuele versie wordt gepubliceerd op https://pseudoai.nl/privacyverklaring en vermeldt de ingangsdatum.

Wanneer dit vereist is, zullen wij aanvullende kennisgeving doen van wezenlijke wijzigingen.

## 19. Contact

Vragen over deze Privacyverklaring of de verwerking van persoonsgegevens door PseudoAI kunnen worden gericht aan:

**PseudoAI**
Dutchhamburgers
Vierbanse Gantel 21, Tilburg
5032 CK Tilburg
Nederland

E-mail: **privacy@pseudoai.nl**
Website: **https://pseudoai.nl**

Voor verwerking die wordt uitgevoerd door uw werkgever of een andere organisatie die PseudoAI gebruikt, kunt u ook contact opnemen met de privacycontactpersoon of functionaris voor gegevensbescherming van die organisatie.

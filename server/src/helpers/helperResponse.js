const message = messages => {
  return typeof messages === 'object' ? messages : { messages: [messages] };
};

const Response = {
  Ok: (res, msg) => res.status(200).json(message(msg || { success: true })),
  Create: (res, msg) => res.status(201).json(message(msg || { success: true })),
  Forbidden: (res, msg) => res.status(403).json(message(msg || 'Geen toegang')),
  BadRequest: (res, msg) => res.status(400).json(message(msg || 'Bad request')),
  Unauthorized: (res, msg) => res.status(401).json(message(msg || 'Niet geauthoriseerd')),
  NotFound: (res, msg) => res.status(404).json(message(msg || 'Niet gevonden')),
  InternalServerError: (res, msg) => res.status(500).json(message(msg || 'Interne server fout')),

  // Custom
  NotFoundUser: (res, msg) => res.status(400).json(message(msg || 'Gebruiker niet gevonden')),
  NotRegisteredUser: (res, msg) => res.status(400).json(message(msg || 'Gebruiker nog niet geregistreerd')),
  BadCode: (res, msg) => res.status(400).json(message(msg || 'Foute code')),
  AlreadyRegisteredUser: (res, msg) => res.status(400).json(message(msg || 'Gebruiker is reeds geregistreerd')),
  InvalidUserOrPass: (res, msg) => res.status(400).json(message(msg || 'Foute gebruikersnaam/wachtwoord')),
  InvalidParams: (res, msg) => res.status(400).json(message(msg || 'Invalid params data')),
  ImapError: (res, msg) => res.status(400).json(message(msg || 'Error reading mails')),
};

export default Response;

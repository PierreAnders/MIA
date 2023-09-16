export default function ({ store, redirect }) {
    // Vérifiez si l'utilisateur est authentifié
    if (!store.state.auth.loggedIn) {
      // Redirigez l'utilisateur vers la page de connexion ou une page d'erreur
      return redirect('/'); // Vous pouvez personnaliser la page de redirection
    }
  }
  
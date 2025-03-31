import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter',
  standalone: true,
  imports: [],
  templateUrl: './ajouter.component.html',
  styleUrl: './ajouter.component.scss'
})
export class AjouterComponent {

  constructor(private router: Router) {

  }

  previewUrl: string | null = null;
  resizedImage: File | null = null;
  errorMessage: string | null = null;

  onFileSelected(event: Event) {
    this.errorMessage = null; // Réinitialisation des erreurs
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Veuillez sélectionner une image valide.';
      return;
    }

    this.resizeAndConvertImage(file);
  }

  resizeAndConvertImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const TARGET_WIDTH = 600;
        const TARGET_HEIGHT = 800;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;

        // Calcul du ratio pour remplir tout l'espace
        const scale = Math.max(TARGET_WIDTH / img.width, TARGET_HEIGHT / img.height);

        // Nouvelle taille après redimensionnement
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;

        // Décalage pour centrer l’image
        const xOffset = (TARGET_WIDTH - newWidth) / 2;
        const yOffset = (TARGET_HEIGHT - newHeight) / 2;

        // Dessiner l’image sur le canvas sans marges
        if (!ctx) {
          this.errorMessage = "Erreur lors du traitement de l'image.";
          return;
        }

        ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);

        // ✅ MAJ immédiate de l'aperçu
        this.previewUrl = canvas.toDataURL("image/png");

        // ✅ Conversion en PNG avec gestion d'erreur
        canvas.toBlob((blob) => {
          if (blob) {
            this.resizedImage = new File([blob], 'image.png', { type: 'image/png' });
          } else {
            this.errorMessage = "Échec de la conversion de l'image.";
          }
        }, 'image/png');
      };

      img.onerror = () => {
        this.errorMessage = "Erreur lors du chargement de l'image.";
      };
    };

    reader.onerror = () => {
      this.errorMessage = "Erreur de lecture du fichier.";
    };

    reader.readAsDataURL(file);
  }

  onValidate() {
    if (this.resizedImage) {
      console.log('Image prête pour l’envoi :', this.resizedImage);
      alert('Image validée et prête pour l’upload !');
    }
  }

  annuler() {
    this.router.navigate(['/dashboard']);
  }
}

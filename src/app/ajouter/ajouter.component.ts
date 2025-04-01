import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-ajouter',
  standalone: true,
  imports: [],
  templateUrl: './ajouter.component.html',
  styleUrl: './ajouter.component.scss'
})
export class AjouterComponent {

  constructor(private router: Router, private http: HttpClient) {

  }

  previewUrl: string | null = null;
  resizedImage: File | null = null;
  errorMessage: string | null = null;
  nom = "defaut";
  description = "defaut";
  stock = 1;

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
        const scale = Math.max(TARGET_WIDTH / img.width, TARGET_HEIGHT / img.height);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        const xOffset = (TARGET_WIDTH - newWidth) / 2;
        const yOffset = (TARGET_HEIGHT - newHeight) / 2;

        if (!ctx) {
          this.errorMessage = "Erreur lors du traitement de l'image.";
          return;
        }

        ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);

        this.previewUrl = canvas.toDataURL("image/webp", 0.8);

        canvas.toBlob((blob) => {
          if (blob) {
            this.resizedImage = new File([blob], 'image.webp', { type: 'image/webp' });
          }
        }, 'image/webp');
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
    if (!this.resizedImage) {
      alert("Veuillez sélectionner une image avant de valider.");
      return;
    }

    const formData = new FormData();
    formData.append("file", this.resizedImage);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vous devez être connecté pour ajouter un bijou.");
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post<{ filename: string }>(environment.backEnd + '/upload', formData, { headers }).subscribe({
      next: (response) => {
        const imagePath = response.filename;

        const bijouData = {
          nom: this.nom,
          img: imagePath,
          description: this.description,
          stock: this.stock
        };

        this.http.post('http://localhost:8000/bijoux', bijouData, { headers }).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.errorMessage = "Erreur lors de l'ajout du bijou.";
          }
        });
      },
      error: (error) => {
        this.errorMessage = "Erreur lors de l'upload de l'image.";
      }
    });
  }

  annuler() {
    this.router.navigate(['/dashboard']);
  }
}

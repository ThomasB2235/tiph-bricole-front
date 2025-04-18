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

  constructor(private router: Router, private http: HttpClient) {}

  previewUrl: string | null = null;
  resizedImage: File | null = null;
  errorMessage: string | null = null;
  nom = "defaut";
  description = "defaut";
  stock = 1;
  token = localStorage.getItem("token");
  formData = new FormData();
  img = new Image();
  reader = new FileReader();

  onFileSelected(event: Event) {
    this.errorMessage = null; // Réinitialisation des erreurs
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Veuillez sélectionner une image valide.';
      return;
    }
    this.resizeAndConvertImage(file);
  }

  resizeAndConvertImage(file: File) {
    this.reader.onload = (e: ProgressEvent<FileReader>) => {
      this.img.src = e.target?.result as string;

      this.img.onload = () => {
        const TARGET_WIDTH = 600;
        const TARGET_HEIGHT = 800;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        const scale = Math.max(TARGET_WIDTH / this.img.width, TARGET_HEIGHT / this.img.height);
        const newWidth = this.img.width * scale;
        const newHeight = this.img.height * scale;
        const xOffset = (TARGET_WIDTH - newWidth) / 2;
        const yOffset = (TARGET_HEIGHT - newHeight) / 2;

        if (!ctx) {
          this.errorMessage = "Erreur lors du traitement de l'image.";
          return;
        }
        ctx.drawImage(this.img, xOffset, yOffset, newWidth, newHeight);
        this.previewUrl = canvas.toDataURL("image/webp", 0.8);
        canvas.toBlob((blob) => {
          if (blob) {
            this.resizedImage = new File([blob], 'image.webp', { type: 'image/webp' });
          }
        }, 'image/webp');
      };

      this.img.onerror = () => {
        this.errorMessage = "Erreur lors du chargement de l'image.";
      };
    };
    this.reader.onerror = () => {
      this.errorMessage = "Erreur de lecture du fichier.";
    };
    this.reader.readAsDataURL(file);
  }

  onValidate() {
    if (!this.resizedImage) {
      alert("Veuillez sélectionner une image avant de valider.");
      return;
    }

    this.formData.append("file", this.resizedImage);

    if (!this.token) {
      alert("Vous devez être connecté pour ajouter un bijou.");
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.post<{ filename: string }>(environment.backEnd + '/upload', this.formData, { headers }).subscribe({
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

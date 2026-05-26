# SmartHerz Assistant FE

Frontend osnova za SmartHerz Assistant aplikaciju.

Projekat je postavljen na `Next.js` App Router arhitekturi i trenutno predstavlja pocetni UI skeleton za dalje razvijanje asistenta. Fokus ove baze je da obezbedi stabilan frontend setup, osnovni layout, UI biblioteku i staticki build/deploy flow.

## Sadrzaj

- [Pregled](#pregled)
- [Tehnoloski stack](#tehnoloski-stack)
- [Trenutna implementacija](#trenutna-implementacija)
- [Struktura projekta](#struktura-projekta)
- [Pokretanje projekta](#pokretanje-projekta)
- [Dostupne skripte](#dostupne-skripte)
- [Konfiguracija](#konfiguracija)
- [Build i deploy](#build-i-deploy)
- [Napomene](#napomene)

## Pregled

Ovaj repozitorijum sadrži frontend osnovu za SmartHerz Assistant. Trenutna verzija nije gotov proizvodni interfejs, vec polazna tačka za razvoj glavnih UI modula i integracija.

Cilj postojeće postavke je:

- da obezbedi `Next.js` frontend sa `TypeScript` podrskom
- da uvede `MUI` kao glavnu UI biblioteku
- da pripremi projekat za internacionalizaciju preko `i18next`
- da omoguci staticki export za jednostavniji deploy

## Tehnoloski stack

- `Next.js 14`
- `React 18`
- `TypeScript`
- `MUI`
- `Emotion`
- `i18next`
- `Axios`
- `Fabric.js`

## Trenutna implementacija

Trenutno je u kodu implementirano sledeće:

- root layout preko `src/app/layout.tsx`
- učitavanje `Inter` i `Roboto Mono` fontova preko `next/font/google`
- globalni stilovi i osnovne CSS varijable u `src/app/globals.css`
- pocetna strana sa dvokolonskim `MUI Box` layout-om u `src/app/page.tsx`
- responsive raspored:
  - jedna kolona na manjim ekranima
  - dve kolone od `md` breakpoint-a
- placeholder paneli `LEFT` i `RIGHT` kao osnova za buduce module

Biblioteke za internacionalizaciju i dodatne integracije su instalirane, ali jos nisu povezane u aktivan UI flow.

## Struktura projekta

```text
.
|-- globals.d.ts
|-- next.config.js
|-- package.json
|-- public/
`-- src/
    `-- app/
        |-- favicon.ico
        |-- globals.css
        |-- layout.tsx
        |-- page.module.css
        `-- page.tsx
```

Najbitniji fajlovi:

- `src/app/page.tsx` - pocetna stranica i trenutni layout aplikacije
- `src/app/layout.tsx` - globalni layout i font konfiguracija
- `src/app/globals.css` - osnovni globalni stilovi
- `next.config.js` - build i deploy konfiguracija
- `globals.d.ts` - TypeScript deklaracija za CSS importe

## Pokretanje projekta

### Preduslovi

- `Node.js` LTS
- `npm`

### Instalacija

```bash
npm install
```

### Development server

```bash
npm run dev
```

Posle pokretanja, aplikacija je dostupna na `http://localhost:3000`.

## Dostupne skripte

```bash
npm run dev
npm run build
npm run lint
```

Značenje skripti:

- `npm run dev` - pokreće development server
- `npm run build` - pravi produkcioni statički build
- `npm run lint` - pokreće ESLint proveru

## Konfiguracija

Projekat koristi `next.config.js` sa sledećim bitnim podešavanjima:

- `output: "export"` za statički export
- `trailingSlash: true`
- `basePath` i `assetPrefix` preko `NEXT_PUBLIC_BASE_PATH`
- `images.unoptimized: true`
- dozvoljen remote image host `cybercompany.ai`
- uključen `topLevelAwait` u webpack eksperimentima

### Environment promenljive

Opcionalno:

```bash
NEXT_PUBLIC_BASE_PATH=/ime-putanje
```

Koristi se kada aplikacija treba da bude servirana iza podputanje.

Na Windows PowerShell-u:

```powershell
$env:NEXT_PUBLIC_BASE_PATH="/ime-putanje"
```

## Build i deploy

Za produkcioni build:

```bash
npm run build
```

Statički izlaz se generiše u `out/` folderu.

Za lokalni preview statičkog build-a koristi:

```bash
npx serve@latest out
```

`npm start` trenutno nije validan runtime flow za ovaj projekat, zato sto `Next.js` sa `output: "export"` ne podrzava `next start`.

## Napomene

- `page.module.css` trenutno postoji u repozitorijumu, ali aktivna početna strana koristi `MUI` stilizaciju iz `page.tsx`.
- Implementacija je trenutno osnova projekta, ne finalni korisnicki interfejs.
- Internacionalizacija je pripremljena na nivou zavisnosti, ali nije još integrisana u aplikacioni tok.

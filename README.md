![](https://gitlab.com/cape-modeler/frontend/wikis/uploads/0f5dde93fdc7f027a656aed68cddfcdf/icon.png)

# CaPE - Modeler - Frontend

> Repository für das Frontend des CaPE - Modelers

:rocket: **Verfügbar unter [https://cape-modeler.gitlab.io/frontend/](https://cape-modeler.gitlab.io/frontend/)**


---


## :book: Wiki

Im [Confluence - Wiki](https://portal.dbis.info/confluence/display/CM) finden sich die Dokumentation, Guidelines und vieles mehr

## :inbox_tray: Task Tracker

Alle Tasks werden mit [JIRA](https://portal.dbis.info/jira/projects/CM/summary) verwaltet

## :clipboard: Changelog

Im [Changelog](https://gitlab.com/cape-modeler/frontend/blob/master/CHANGELOG.md) werden alle Änderungen festgehalten

## :flashlight: Coding Guidelines

Die [Coding-Guidelines](https://portal.dbis.info/confluence/display/CM/Coding+Guidelines) geben Auskunft über den Workflow und grundsätzliche Entwicklungs-Guidelines

## :file_folder: Datei Struktur

Eine Erklärung der [Datei-Struktur](https://portal.dbis.info/confluence/display/CM/Dateistruktur) findet sich im Wiki

## :mag: E2E-Test Dashboard

Die E2E Tests werden aufgezeichnet und sind dann auf [Cypress Dashboard](https://dashboard.cypress.io/#/projects/6623by/runs) zur Einsicht verfügbar

## :computer: Technologiestack

Das Wiki gibt eine Übersicht über den [Technologiestack](https://portal.dbis.info/confluence/display/CM/Technologie+Stack)

## :question: FAQ

Die [FAQ-Seite](https://portal.dbis.info/confluence/display/CM/FAQ) beantwortet womöglich noch offene Fragen

## :gear: Project Setup

Dependencies installieren

```
npm install
```

### Development Server

Den Development Server inklusive Hot-Reloading starten

```
npm run serve
```

### Production Build

Den Code kompilieren und minifizieren für die Produktion

```
npm run build
```

### Linting

Den Code auf Einhaltung der Coding-Standards *linten* und eventuell automatisch korrigieren

```
npm run lint
```

### Unit Tests

Die Unit-Tests ausführen

```
npm run test:unit
```

### E2E Tests

Die End-to-End Tests ausführen

```
npm run test:e2e
```

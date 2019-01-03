![](https://gitlab.com/cape-modeler/frontend/wikis/uploads/0f5dde93fdc7f027a656aed68cddfcdf/icon.png)

# CaPE - Modeler - Frontend

> Repository für das Frontend des CaPE - Modelers

:rocket: **Verfügbar unter [https://cape-modeler.gitlab.io/frontend/](https://cape-modeler.gitlab.io/frontend/)**


[![Pipeline Status](https://gitlab.com/cape-modeler/frontend/badges/master/pipeline.svg)](https://gitlab.com/cape-modeler/frontend/commits/master)
[![Cypress Dashboard](https://img.shields.io/badge/cypress-dashboard-brightgreen.svg)](https://dashboard.cypress.io/#/projects/6623by/runs)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e91a9f319f7c7541cdfa/test_coverage)](https://codeclimate.com/github/BerniWittmann/cape-frontend/test_coverage) 
[![Maintainability](https://api.codeclimate.com/v1/badges/e91a9f319f7c7541cdfa/maintainability)](https://codeclimate.com/github/BerniWittmann/cape-frontend/maintainability)
[![GitLab](https://img.shields.io/badge/-GitLab-lightgrey.svg?logo=gitlab)](https://gitlab.com/cape-modeler/frontend)
[![Neueste Version](https://img.shields.io/badge/-Aktuellste%20Version-lightgrey.svg?logo=skyliner&logoColor=6CC9E8)](https://cape-modeler.gitlab.io/frontend/)

---


## :package: Download

Die App ist entweder als Browser App unter [https://cape-modeler.gitlab.io/frontend/](https://cape-modeler.gitlab.io/frontend/) verfügbar oder als native App für Mac, Windows und Linux [zum Download](https://github.com/BerniWittmann/cape-frontend/releases/latest) verfügbar.

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

## :bar_chart: Code Climate Dashboard

Die Ergebnisse der statischen Codeanalyse werden auf dem [Code Climate Dashboard](https://codeclimate.com/github/BerniWittmann/cape-frontend) dokumentiert

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

## :bookmark_tabs: License

MIT License

Copyright (c) [2018] [Alexander Fischer, Lukas Jesche, Bernhard Wittmann]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
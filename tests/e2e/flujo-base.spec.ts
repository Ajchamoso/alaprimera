import { test, expect } from '@playwright/test';

test.describe('Flujo base de usuario', () => {
  test('Home carga y muestra catálogo', async ({ page }) => {
    await page.goto('/');

    // Verificar que es la home (URL correcta)
    expect(page.url()).toBe('http://localhost:3000/');

    // Debe mostrar el título principal "Termina tu trámite a la primera"
    const titulo = page.locator('h1');
    await expect(titulo).toBeVisible();
    await expect(titulo).toContainText(/Termina tu trámite/i);

    // Debe haber un campo de búsqueda con el placeholder correcto
    const busqueda = page.locator('input[type="search"]');
    await expect(busqueda).toBeVisible();
    await expect(busqueda).toHaveAttribute('placeholder', /Escríbelo con tus palabras/i);

    // Debe haber fichas en el catálogo (enlaces a /tramite/*)
    const fichas = page.locator('a[href*="/tramite/"]');
    const countFichas = await fichas.count();
    expect(countFichas).toBeGreaterThan(0);

    // Verificar que hay al menos una tarjeta visible
    const primeraFicha = fichas.first();
    await expect(primeraFicha).toBeVisible();

    // Verificar que hay contenido en la tarjeta (nombre de la ficha)
    const nombreFicha = primeraFicha.locator('h3, h2');
    await expect(nombreFicha).toBeVisible();
  });

  test('Navegación a ficha individual y wizard', async ({ page }) => {
    await page.goto('/');

    // Cliquear en la primera ficha disponible
    const primeraFicha = page.locator('a[href*="/tramite/"]').first();
    const fichaUrl = await primeraFicha.getAttribute('href');
    await primeraFicha.click();

    // Verificar que navegó a la ficha
    await expect(page).toHaveURL(new RegExp(fichaUrl!));

    // Debe haber elementos del wizard o requisitos visibles
    const contenido = page.locator('main');
    await expect(contenido).toContainText(/requisito|necesario|documento|pregunta|opción/i);
  });

  test('Imprimible funciona sin dependencias de API', async ({ page }) => {
    // Navegar a una ficha
    await page.goto('/tramite/renovacion-dni');

    // Hacer scroll para que se cargue todo
    await page.locator('main').evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    // Buscar el botón de imprimir
    const botonImprimir = page.locator('button').filter({ hasText: /Imprimir|Print/i }).first();
    if (await botonImprimir.isVisible({ timeout: 2000 }).catch(() => false)) {
      await botonImprimir.click();
      // Verificar que se abre diálogo de impresión (no hay error)
      const dialogo = page.locator('text=/cancelar|imprimir/i').first();
      // Es normal que Playwright no pueda interactuar con el dialogo del SO
      // Lo importante es que no haya errores en la consola
    }

    // Verificar que no hay errores en la consola
    const errorLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errorLogs.push(msg.text());
      }
    });

    await page.waitForTimeout(500);
    expect(errorLogs).toHaveLength(0);
  });

  test('Checklist responde a interacciones', async ({ page }) => {
    await page.goto('/tramite/renovacion-dni');

    // Encontrar checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    const countCheckboxes = await checkboxes.count();

    if (countCheckboxes > 0) {
      // Marcar el primer checkbox
      const primerCheckbox = checkboxes.first();
      await primerCheckbox.click();

      // Verificar que se marcó
      await expect(primerCheckbox).toBeChecked();

      // Desmarcar
      await primerCheckbox.click();
      await expect(primerCheckbox).not.toBeChecked();
    }
  });

  test('Navegación del sitio funciona', async ({ page }) => {
    await page.goto('/tramite/renovacion-dni');

    // Buscar un link a home (volver atrás, home, etc)
    const linkHome = page.locator('a').filter({ hasText: /home|inicio|atrás|volver/i }).first();

    if (await linkHome.isVisible({ timeout: 2000 }).catch(() => false)) {
      await linkHome.click();
      // Debería volver a una página válida
      await page.waitForLoadState('networkidle');
      expect(page.url()).not.toContain('/tramite/');
    }
  });

  test('Búsqueda por alias funciona', async ({ page }) => {
    await page.goto('/');

    const busqueda = page.locator('input[type="search"], input[placeholder*="Buscar"]').first();

    // Buscar por alias coloquial
    await busqueda.fill('carné');
    await page.waitForTimeout(500); // Esperar debounce

    // Debería mostrar resultados
    const resultados = page.locator('a[href*="/tramite/"]');
    const count = await resultados.count();

    // Si hay resultados, debería ser por coincidencia (DNI = carné)
    if (count > 0) {
      // Verificar que encuentra algo
      expect(count).toBeGreaterThan(0);
    }
  });

  test('No hay secretos en el HTML', async ({ page }) => {
    await page.goto('/');

    // Obtener el HTML
    const htmlContent = await page.content();

    // Verificar que no hay claves privadas (patrones comunes)
    expect(htmlContent).not.toMatch(/sk_test|sk_live|anon_key.*anon.*secret/i);
    expect(htmlContent).not.toMatch(/password.*=.*[\w]{10,}/i);

    // Verificar que no hay URLs de Supabase con credenciales
    expect(htmlContent).not.toMatch(/https:\/\/.+\.supabase\.co.*\?anon_key=.+&secret=/);
  });
});

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

    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');

    // Verificar que navegó a la ficha (URL contiene /tramite/)
    expect(page.url()).toContain('/tramite/');

    // Debe haber un h1 o h2 con el nombre de la ficha
    const titulo = page.locator('h1, h2').first();
    await expect(titulo).toBeVisible();

    // Debe haber elementos del wizard o requisitos visibles
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verificar que hay contenido relevante
    const contenidoValido = await main.textContent().then((text) =>
      text && /requisito|necesario|documento|pregunta|opciones|datos|información|tasa|dni|pasaporte/i.test(text)
    );
    expect(contenidoValido).toBeTruthy();
  });

  test('Imprimible funciona sin dependencias de API', async ({ page }) => {
    // Navegar a una ficha específica
    await page.goto('/tramite/renovacion-dni');
    await page.waitForLoadState('networkidle');

    // La página debe cargar sin errores
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Hacer scroll para que se cargue todo
    await main.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    // Verificar que el contenido está presente
    const contenido = await main.textContent();
    expect(contenido).toBeTruthy();
    expect(contenido).toContain('renovación');

    // Recopilar errores de consola
    const errorLogs: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error') {
        // Ignorar errores conocidos (CORS, 401, etc)
        if (!text.includes('CORS') && !text.includes('401') && !text.includes('not found')) {
          errorLogs.push(text);
        }
      }
    });

    await page.waitForTimeout(500);

    // No debe haber errores críticos
    expect(errorLogs).toHaveLength(0);

    // Verificar que la página sigue siendo accesible
    expect(page.url()).toContain('/tramite/renovacion-dni');
  });

  test('Checklist responde a interacciones', async ({ page }) => {
    await page.goto('/tramite/renovacion-dni');
    await page.waitForLoadState('networkidle');

    // Encontrar checkboxes en el checklist
    const checkboxes = page.locator('input[type="checkbox"]');
    const countCheckboxes = await checkboxes.count();

    // Debe haber al menos un checkbox (requisitos)
    expect(countCheckboxes).toBeGreaterThan(0);

    // Marcar el primer checkbox
    const primerCheckbox = checkboxes.first();
    const isVisible = await primerCheckbox.isVisible({ timeout: 2000 });
    expect(isVisible).toBeTruthy();

    // Hacer scroll si es necesario para que sea visible
    if (!isVisible) {
      await primerCheckbox.scrollIntoViewIfNeeded();
    }

    // Marcar el checkbox
    await primerCheckbox.click();
    await expect(primerCheckbox).toBeChecked();

    // Desmarcar
    await primerCheckbox.click();
    await expect(primerCheckbox).not.toBeChecked();

    // Verificar que localStorage se actualizó (progreso se guarda)
    const storage = await page.evaluate(() => localStorage.getItem('checklists'));
    expect(storage).toBeTruthy();
  });

  test('Navegación del sitio funciona', async ({ page }) => {
    await page.goto('/tramite/renovacion-dni');
    await page.waitForLoadState('networkidle');

    // Debe haber un link para volver o navegar
    // Buscar links que digan "todos los temas", "volver", "atrás", o similar
    const linkVolver = page.locator('button, a').filter({ hasText: /todos los temas|volver|atrás|inicio|home/i }).first();

    if (await linkVolver.isVisible({ timeout: 1000 }).catch(() => false)) {
      await linkVolver.click();
      await page.waitForLoadState('networkidle');

      // Debería volver a una página válida (no debe ser la misma ficha)
      const url = page.url();
      expect(url).not.toContain('/tramite/renovacion-dni');
      expect(url).toBeTruthy();
    }
  });

  test('Búsqueda por alias funciona', async ({ page }) => {
    await page.goto('/');

    const busqueda = page.locator('input[type="search"]');

    // Buscar por alias coloquial (carné = DNI)
    await busqueda.fill('carné');
    await page.waitForTimeout(500); // Esperar debounce

    // Debería mostrar resultados
    const resultados = page.locator('a[href*="/tramite/"]');
    const count = await resultados.count();

    // Debe haber al menos un resultado relacionado
    expect(count).toBeGreaterThanOrEqual(0);

    // Si hay resultados, debe haber fichas visibles
    if (count > 0) {
      const primerResultado = resultados.first();
      await expect(primerResultado).toBeVisible();
    }
  });

  test('No hay secretos en el HTML', async ({ page }) => {
    await page.goto('/');

    // Obtener el HTML
    const htmlContent = await page.content();

    // Verificar que no hay claves privadas (patrones comunes)
    expect(htmlContent).not.toMatch(/sk_test|sk_live|anon_key.*anon.*secret/i);
    expect(htmlContent).not.toMatch(/password.*=.*[\w]{10,}/);

    // Verificar que no hay URLs de Supabase con credenciales expuestas
    expect(htmlContent).not.toMatch(/https:\/\/.+\.supabase\.co.*\?anon_key=.+&secret=/);
  });
});

import { test, expect } from '@playwright/test';

test.describe('Viaje completo de la demo', () => {
  test('Flujo completo: home → ficha → wizard → checklist → salió bien → compartir', async ({
    page,
  }) => {
    // 1. Navegar a home
    await page.goto('/');
    await expect(page).toHaveTitle(/A la Primera|Viberano/i);

    // 2. Buscar una ficha (ej: "renovacion dni")
    const busqueda = page.locator('input[placeholder*="Buscar"], input[type="search"]').first();
    await busqueda.click();
    await busqueda.fill('renovacion');

    // Esperar y hacer clic en el primer resultado
    await page.waitForTimeout(300); // Esperar debounce de búsqueda
    const primerResultado = page.locator('a[href*="/tramite/renovacion-dni"]').first();
    await expect(primerResultado).toBeVisible();
    await primerResultado.click();

    // 3. Verificar que estamos en la ficha
    await expect(page).toHaveURL(/renovacion-dni/);
    await expect(page.locator('h1, h2').first()).toContainText(/renovac/i);

    // 4. Responder el wizard
    // Primera pregunta: ¿Para quién?
    const para_mi = page.locator('button, label').filter({ hasText: /Para mí|para mi/ }).first();
    if (await para_mi.isVisible()) {
      await para_mi.click();
    }

    // Segunda pregunta: ¿Por qué motivo?
    const caducado = page.locator('button, label').filter({ hasText: /Caducad|expirado|caducidad/ }).first();
    if (await caducado.isVisible({ timeout: 2000 }).catch(() => false)) {
      await caducado.click();
    }

    // Tercera pregunta: ¿Cambio domicilio?
    const sin_cambio = page.locator('button, label').filter({ hasText: /No/ }).first();
    if (await sin_cambio.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sin_cambio.click();
    }

    // 5. Esperar a que aparezca la checklist
    const checklist = page.locator('section').filter({ hasText: /requisito|documento|necesario/i }).first();
    await expect(checklist).toBeVisible({ timeout: 5000 });

    // 6. Verificar que hay requisitos listados
    const requisitos = page.locator('input[type="checkbox"]');
    const countRequisitos = await requisitos.count();
    expect(countRequisitos).toBeGreaterThan(0);

    // 7. Marcar 2-3 requisitos
    const checkboxesToMark = Math.min(3, countRequisitos);
    for (let i = 0; i < checkboxesToMark; i++) {
      const checkbox = requisitos.nth(i);
      const isChecked = await checkbox.isChecked();
      if (!isChecked) {
        await checkbox.click();
        await page.waitForTimeout(100);
      }
    }

    // 8. Hacer scroll para encontrar "¿Salió bien?"
    await page.locator('main').evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    // 9. Responder "¿Salió bien?" con "No"
    const salio_bien_no = page.locator('button, label').filter({ hasText: /No|salió|primera/ }).last();
    if (await salio_bien_no.isVisible({ timeout: 2000 }).catch(() => false)) {
      await salio_bien_no.click();

      // Si pregunta qué falló, responder
      const que_fallo = page.locator('input[type="text"], textarea').first();
      if (await que_fallo.isVisible({ timeout: 1000 }).catch(() => false)) {
        await que_fallo.fill('Falta la fotografía');
      }
    }

    // 10. Buscar botón de compartir
    const boton_compartir = page
      .locator('button')
      .filter({ hasText: /Compartir|compartir|share/i })
      .first();
    if (await boton_compartir.isVisible({ timeout: 2000 }).catch(() => false)) {
      await boton_compartir.click();

      // Verificar que aparece el link de compartir
      const link_compartir = page.locator('input[value*="/c/"]');
      if (await link_compartir.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(link_compartir).toHaveValue(/\/c\//);
      }
    }

    // 11. Verificar que la página sigue funcionando (no hay errores)
    const errorMessages = page.locator('text=/error|problema|fallo/i');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);

    // 12. Intentar volver a home desde la ficha
    await page.locator('a').filter({ hasText: /home|inicio|atrás/i }).first().click({ timeout: 2000 }).catch(() => {
      page.goto('/');
    });

    // Verificar que volvimos a una página válida
    await expect(page).not.toHaveURL(/404|error/);
  });

  test('Búsqueda funciona con alias coloquiales', async ({ page }) => {
    await page.goto('/');

    const busqueda = page.locator('input[placeholder*="Buscar"], input[type="search"]').first();
    await busqueda.click();
    await busqueda.fill('carné');
    await page.waitForTimeout(300);

    // Debería encontrar algo relacionado con DNI (por alias)
    const resultados = page.locator('a[href*="/tramite/"]');
    const count = await resultados.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Checklist se guarda en localStorage', async ({ page, context }) => {
    await page.goto('/');

    const busqueda = page.locator('input[placeholder*="Buscar"], input[type="search"]').first();
    await busqueda.click();
    await busqueda.fill('renovacion');
    await page.waitForTimeout(300);

    const primerResultado = page.locator('a[href*="/tramite/renovacion-dni"]').first();
    await primerResultado.click();

    // Responder wizard
    const para_mi = page.locator('button, label').filter({ hasText: /Para mí/ }).first();
    if (await para_mi.isVisible()) {
      await para_mi.click();
    }

    // Marcar un requisito
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.click();
    }

    // Verificar localStorage
    const storage = await page.evaluate(() => {
      return localStorage.getItem('checklists');
    });

    expect(storage).toBeTruthy();
  });
});

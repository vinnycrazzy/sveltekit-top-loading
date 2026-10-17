import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.getByLabel('Tela inteira')).toBeEnabled();
});

test('shows and completes the bar during navigation', async ({ page }) => {
	await page.getByRole('link', { name: 'Page 1', exact: true }).click();
	await expect(page.locator('#nprogress .bar')).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Page 1' })).toBeVisible();
	await expect(page.locator('#nprogress')).toHaveCount(0);
});

test('fullscreen displays logo, message and centered spinner on mobile', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.getByLabel('Tela inteira').check();
	await page.getByRole('link', { name: 'Page 2', exact: true }).click();
	const status = page.getByRole('status');
	await expect(status).toBeVisible();
	await expect(status).toHaveText('Carregando página…');
	await expect(status.getByRole('img', { name: 'Top Loader' })).toBeVisible();
	await expect(status.locator('.center-spinner')).toBeVisible();
	await expect(status).toHaveCSS('position', 'fixed');
	await page.screenshot({ path: '/tmp/top-loader-mobile.png' });
	await expect(page.getByRole('heading', { name: 'Page 2' })).toBeVisible();
	await expect(status).toHaveCount(0);
});

test('respects spinner and delay options', async ({ page }) => {
	await page.getByLabel('Spinner', { exact: true }).uncheck();
	await page.getByLabel('Atraso (ms)').fill('2000');
	await page.getByRole('link', { name: 'Page 1', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Page 1' })).toBeVisible();
	await expect(page.locator('#nprogress')).toHaveCount(0);
	await expect(page.getByRole('status')).toHaveCount(0);
});

test('cancelled navigation does not start the loader', async ({ page }) => {
	await page.evaluate(() => {
		const link = document.createElement('a');
		link.href = '/page1?cancel';
		link.textContent = 'Cancelled navigation';
		document.body.appendChild(link);
	});
	await page.getByRole('link', { name: 'Cancelled navigation' }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.locator('#nprogress')).toHaveCount(0);
});

test('back navigation completes and reduced motion disables spinner animation', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.getByRole('link', { name: 'Page 1', exact: true }).click();
	await expect(page.locator('#nprogress .spinner-icon')).toHaveCSS('animation-name', 'none');
	await expect(page.getByRole('heading', { name: 'Page 1' })).toBeVisible();
	await page.goBack();
	await expect(
		page.getByRole('heading', { name: 'SvelteKit Top Loader', exact: true })
	).toBeVisible();
	await expect(page.locator('#nprogress')).toHaveCount(0);
});

test('custom fullscreen content replaces logo and spinner', async ({ page }) => {
	await page.getByLabel('Tela inteira').check();
	await page.getByLabel('Conteúdo personalizado').check();
	await page.getByRole('link', { name: 'Page 1', exact: true }).click();
	const status = page.getByRole('status');
	await expect(status.getByText('Meu aplicativo')).toBeVisible();
	await expect(status.locator('img, .center-spinner')).toHaveCount(0);
	await page.screenshot({ path: '/tmp/top-loader-desktop.png' });
	await expect(page.getByRole('heading', { name: 'Page 1' })).toBeVisible();
	await expect(status).toHaveCount(0);
});

test('error pages also finish the loading indicator', async ({ page }) => {
	await page.evaluate(() => {
		const link = document.createElement('a');
		link.href = '/page1?error';
		link.textContent = 'Error navigation';
		document.body.appendChild(link);
	});
	await page.getByRole('link', { name: 'Error navigation' }).click();
	await expect(page.locator('#nprogress .bar')).toBeVisible();
	await expect(page.getByRole('heading', { name: '500' })).toBeVisible();
	await expect(page.locator('#nprogress')).toHaveCount(0);
	await expect(page.getByRole('status')).toHaveCount(0);
});

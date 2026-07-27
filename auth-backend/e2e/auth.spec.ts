import { test, expect } from '@playwright/test';

const ID_PORTAL_URL = 'http://localhost:5173';
const CMS_URL = 'http://localhost:5175';
const AUTH_API_URL = 'http://localhost:3001/api/v1';
const SMS_API_URL = 'http://localhost:3002/api/v1';
const EMAIL_API_URL = 'http://localhost:3003/api/v1';
const LOG_API_URL = 'http://localhost:3004/api/v1';

test.describe('ID Portal E2E Tests', () => {
  test.describe('Registration Flow', () => {
    test('should register a new user', async ({ page }) => {
      const uniqueEmail = `e2e-${Date.now()}@test.com`;
      await page.goto(`${ID_PORTAL_URL}/register`);

      await page.fill('[data-testid="register-name-input"]', 'E2E Test User');
      await page.fill('[data-testid="register-email-input"]', uniqueEmail);
      await page.fill('[data-testid="register-password-input"]', 'password123');

      await page.click('[data-testid="register-submit-button"]');

      await expect(page).toHaveURL(/verify-email/);
    });

    test('should show validation errors for invalid data', async ({ page }) => {
      await page.goto(`${ID_PORTAL_URL}/register`);

      await page.click('[data-testid="register-submit-button"]');

      await expect(page.locator('[data-testid="register-error-message"]')).toBeVisible();
    });
  });

  test.describe('Login Flow', () => {
    test('should login successfully', async ({ page }) => {
      // Register first
      const uniqueEmail = `login-${Date.now()}@test.com`;
      await page.goto(`${ID_PORTAL_URL}/register`);
      await page.fill('[data-testid="register-name-input"]', 'Login Test');
      await page.fill('[data-testid="register-email-input"]', uniqueEmail);
      await page.fill('[data-testid="register-password-input"]', 'password123');
      await page.click('[data-testid="register-submit-button"]');
      await expect(page).toHaveURL(/verify-email/);

      // Login
      await page.goto(`${ID_PORTAL_URL}/login`);
      await page.fill('[data-testid="login-identifier-input"]', uniqueEmail);
      await page.fill('[data-testid="login-password-input"]', 'password123');
      await page.click('[data-testid="login-submit-button"]');

      await expect(page).toHaveURL(/profile/);
    });

    test('should show error for wrong credentials', async ({ page }) => {
      await page.goto(`${ID_PORTAL_URL}/login`);

      await page.fill('[data-testid="login-identifier-input"]', 'wrong@test.com');
      await page.fill('[data-testid="login-password-input"]', 'wrongpassword');
      await page.click('[data-testid="login-submit-button"]');

      await expect(page.locator('[data-testid="login-error-message"]')).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      await page.goto(`${ID_PORTAL_URL}/profile`);

      await expect(page).toHaveURL(/login/);
    });

    test('should access profile when authenticated', async ({ page }) => {
      // Register and login
      const uniqueEmail = `profile-${Date.now()}@test.com`;
      await page.goto(`${ID_PORTAL_URL}/register`);
      await page.fill('[data-testid="register-name-input"]', 'Profile Test');
      await page.fill('[data-testid="register-email-input"]', uniqueEmail);
      await page.fill('[data-testid="register-password-input"]', 'password123');
      await page.click('[data-testid="register-submit-button"]');
      await expect(page).toHaveURL(/verify-email/);

      await page.goto(`${ID_PORTAL_URL}/login`);
      await page.fill('[data-testid="login-identifier-input"]', uniqueEmail);
      await page.fill('[data-testid="login-password-input"]', 'password123');
      await page.click('[data-testid="login-submit-button"]');
      await expect(page).toHaveURL(/profile/);

      // Verify profile page
      await expect(page.locator('[data-testid="profile-info"]')).toBeVisible();
      await expect(page.locator('[data-testid="profile-name"]')).toContainText('Profile Test');
    });
  });

  test.describe('Forgot Password Flow', () => {
    test('should show success message for forgot password', async ({ page }) => {
      await page.goto(`${ID_PORTAL_URL}/forgot-password`);

      await page.fill('[data-testid="forgot-password-email-input"]', 'test@test.com');
      await page.click('[data-testid="forgot-password-submit-button"]');

      await expect(page.locator('[data-testid="forgot-password-success-message"]')).toBeVisible();
    });
  });
});

test.describe('CMS E2E Tests', () => {
  test.describe('Login Flow', () => {
    test('should show login page', async ({ page }) => {
      await page.goto(`${CMS_URL}/login`);

      await expect(page.locator('[data-testid="cms-login-form"]')).toBeVisible();
    });

    test('should show error for wrong credentials', async ({ page }) => {
      await page.goto(`${CMS_URL}/login`);

      await page.fill('[data-testid="cms-login-identifier-input"]', 'wrong@test.com');
      await page.fill('[data-testid="cms-login-password-input"]', 'wrongpassword');
      await page.click('[data-testid="cms-login-submit-button"]');

      await expect(page.locator('[data-testid="cms-login-error-message"]')).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      await page.goto(`${CMS_URL}/users`);

      await expect(page).toHaveURL(/login/);
    });
  });
});

test.describe('API Integration Tests', () => {
  test('should register via API', async ({ request }) => {
    const uniqueEmail = `api-test-${Date.now()}@test.com`;
    const response = await request.post(`${AUTH_API_URL}/auth/register`, {
      data: {
        name: 'API Test User',
        email: uniqueEmail,
        password: 'password123',
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.email).toBe(uniqueEmail);
  });

  test('should login via API', async ({ request }) => {
    const uniqueEmail = `api-login-${Date.now()}@test.com`;
    await request.post(`${AUTH_API_URL}/auth/register`, {
      data: { name: 'API Login Test', email: uniqueEmail, password: 'password123' },
    });

    const response = await request.post(`${AUTH_API_URL}/auth/login`, {
      data: { identifier: uniqueEmail, password: 'password123' },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
  });

  test('should reject invalid login', async ({ request }) => {
    const response = await request.post(`${AUTH_API_URL}/auth/login`, {
      data: {
        identifier: 'nonexistent@test.com',
        password: 'wrongpassword',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should validate registration data', async ({ request }) => {
    const response = await request.post(`${AUTH_API_URL}/auth/register`, {
      data: {
        email: 'invalid-email',
        password: '123',
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toContain('name must be a string');
  });

  test('should send and verify SMS OTP', async ({ request }) => {
    // Send OTP
    const sendResponse = await request.post(`${SMS_API_URL}/sms/send`, {
      data: {
        phone: '+1234567890',
        message: 'Your OTP is 654321',
        otpCode: '654321',
      },
    });

    expect(sendResponse.ok()).toBeTruthy();

    // Verify OTP
    const verifyResponse = await request.post(`${SMS_API_URL}/sms/verify`, {
      data: {
        phone: '+1234567890',
        otpCode: '654321',
      },
    });

    expect(verifyResponse.ok()).toBeTruthy();
    const body = await verifyResponse.json();
    expect(body.verified).toBe(true);
  });
});

# Testing: Fase 1A — Backend + Frontend Foundation

## Verify Feature Is Active

```bash
# Backend corriendo
cd backend && make dev
curl http://localhost:8000/health  # → {"status": "ok"}
curl http://localhost:8000/docs    # → Swagger UI

# Frontend corriendo
cd frontend && npm run dev
# Abrir http://localhost:3000 → landing page de AgentCraft
```

## Main Test Cases

| # | Action | Input | Expected Result |
|---|--------|-------|-----------------|
| 1 | Visitar `/` sin sesión | GET `/` | Landing page con hero + 3 features + links a /login y /signup |
| 2 | Visitar `/map` sin sesión | GET `/map` | Redirect a `/login` |
| 3 | Signup nuevo usuario | email + password válidos | Redirect a `/map`, sesión activa |
| 4 | Login con credenciales correctas | email + password | Redirect a `/map` |
| 5 | Login con credenciales incorrectas | password wrong | Mensaje de error visible, sin redirect |
| 6 | Logout desde Navbar | Click "Salir" | Redirect a `/login`, sesión eliminada |
| 7 | Navegar Sidebar autenticado | Click "Modulos" | Navega a `/modules` |
| 8 | Skill Tree `/map` autenticado | GET `/map` | Lista de 11 módulos con tier badges |
| 9 | GET /api/xp autenticado | Bearer token válido | `{total_xp, current_level, level_title, ...}` |
| 10 | GET /api/xp sin token | Sin header | 403 Forbidden |
| 11 | POST /api/progress/complete | `{module_id, lesson_id}` | `{xp_awarded, new_total_xp, new_level}` |

## Edge Cases & Validations

| # | Scenario | Expected Behavior |
|---|----------|-------------------|
| 1 | Token Supabase expirado | Middleware redirige a `/login` automáticamente |
| 2 | Backend no disponible | `fetch` falla, UI muestra error genérico |
| 3 | Email ya registrado en signup | Supabase retorna error, UI muestra mensaje |
| 4 | Usuario accede a `/login` ya logueado | Middleware redirige a `/map` |
| 5 | Navegar a ruta inexistente | Next.js muestra 404 |

## Verify in Logs

```bash
# Backend — request autenticado exitoso
INFO: GET /api/xp - 200 OK
INFO: user_id=abc123 xp_total=150

# Backend — token inválido
WARNING: Invalid JWT token - 403

# Frontend — middleware
# En dev tools Network: req a /map sin cookie → 302 a /login
```

## Database Verification

```sql
-- Verificar que el signup creó todas las filas necesarias
SELECT id, username FROM profiles WHERE id = '<user-id>';
SELECT user_id, total_xp FROM user_xp WHERE user_id = '<user-id>';
SELECT user_id, current_streak FROM user_streaks WHERE user_id = '<user-id>';

-- Verificar XP después de completar una lección
SELECT * FROM xp_events WHERE user_id = '<user-id>' ORDER BY created_at DESC LIMIT 5;
SELECT * FROM lesson_progress WHERE user_id = '<user-id>';
```

## Backend Unit Tests

```bash
cd backend && pytest tests/ -v
# Debe pasar: 15 tests en test_progress.py, test_gamification.py, test_tutor.py
```

## Graceful Degradation

- Si Supabase está caído: login/signup falla con mensaje de error claro
- Si el backend está caído: las páginas de la academia cargan (son estáticas), pero `CompleteButton` muestra error

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `/map` redirige a login aunque hay sesión | Cookie de sesión expirada | Hacer logout + login nuevamente |
| 403 en todas las rutas del backend | `SUPABASE_URL` o `SUPABASE_ANON_KEY` incorrectos | Verificar `.env` del backend |
| "relation user_xp does not exist" | Migraciones no aplicadas | Correr las 4 migraciones en Supabase |
| CORS error en browser | `CORS_ORIGINS` no incluye el origen del frontend | Agregar URL en `backend/.env` |

# Smart Leads API

Base URL: `/api`

Authentication:
- All `/api/leads` endpoints require a bearer JWT: `Authorization: Bearer <token>`
- `POST /api/auth/login` and `POST /api/auth/register` return a token on success

Health
- GET /api/health
  - Description: Basic health check
  - Response: { success: true, message: 'Smart Leads API is running' }

Auth
- POST /api/auth/register
  - Body: { name: string, email: string, password: string }
  - Response (201): { success: true, message, data: { token, user } }
  - Notes: `name` required for register; password min 8 chars

- POST /api/auth/login
  - Body: { email: string, password: string }
  - Response (200): { success: true, message, data: { token, user } }

Leads (authenticated)
- GET /api/leads
  - Query params: `page` (int), `limit` (int), `status`, `source`, `search`, `sort` (`latest`|`oldest`)
  - Response (200): { success: true, data: { data: [lead], meta: { page, limit, total, totalPages, hasNextPage, hasPreviousPage, sort, filters } } }

- GET /api/leads/summary
  - Response (200): { success: true, data: { totalLeads, recentCount, statusCounts, sourceCounts } }

- GET /api/leads/export
  - Query params: same as list
  - Response (200): CSV file attachment (`leads_export.csv`)

- POST /api/leads
  - Body: { name: string, email: string, status: 'new'|'contacted'|'qualified'|'lost' (see model), source: 'web'|'referral'|'ad' (see model) }
  - Response (201): { success: true, message: 'Lead created successfully', data: lead }

- GET /api/leads/:leadId
  - Response (200): { success: true, data: lead }

- PATCH /api/leads/:leadId
  - Body: partial same as POST
  - Response (200): { success: true, message: 'Lead updated successfully', data: lead }

- DELETE /api/leads/:leadId
  - Response (200): { success: true, message: 'Lead deleted successfully' }

Error handling
- Errors are returned with appropriate HTTP status codes and a JSON body describing the message.

Notes & model references
- Lead model fields include: `name`, `email`, `status`, `source`, `owner`, `createdAt`, `updatedAt`.
- Role-based access: `admin` users can access all leads; `sales` users only access their own leads.

Example: Login request

POST /api/auth/login

Body:
{
  "email": "alice@example.com",
  "password": "password123"
}

Example: Create lead (authenticated)

POST /api/leads
Headers: `Authorization: Bearer <token>`
Body:
{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "status": "new",
  "source": "web"
}

Response (201):
{
  "success": true,
  "message": "Lead created successfully",
  "data": { /* lead object */ }
}

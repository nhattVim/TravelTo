import { auth } from "@/auth";
import { getAdminUsers } from "@/lib/api/private";
import { UserRoleActions } from "./user-role-actions";

export default async function AdminUsersPage() {
  const session = await auth();
  const token = session?.backendAccessToken;

  const usersResponse = token
    ? await getAdminUsers(token, { page: 0, size: 50 }).catch(() => ({ items: [] }))
    : { items: [] };

  const users = usersResponse.items || [];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">User Management</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#083b2d]">Quản lí user</h2>
        <p className="mt-2 text-sm text-[#355a4d]">
          Danh sách người dùng đã đăng ký vào hệ thống.
        </p>
      </header>

      <section className="rounded-2xl border border-[#cdece0] bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-[#355a4d]">
            Tổng số user: <span className="font-semibold text-[#083b2d]">{users.length}</span>
          </p>
        </div>

        {users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#98d8c0] bg-[#f8fffb] p-6 text-sm text-[#355a4d]">
            Chưa có dữ liệu user.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#355a4d]">
              <thead>
                <tr className="border-b border-[#def1e9] text-xs uppercase tracking-wide text-[#0a7d59]">
                  <th className="px-3 py-2">Họ Tên</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">SĐT</th>
                  <th className="px-3 py-2">Vai trò</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#edf7f3] last:border-0 hover:bg-[#f8fffb]">
                    <td className="px-3 py-3 font-medium text-[#083b2d]">{user.fullName || "N/A"}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3">{user.phone || "---"}</td>
                    <td className="px-3 py-3">
                      {token && (
                        <UserRoleActions token={token} userId={user.id} currentRole={user.role} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

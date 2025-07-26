'use client';

import {
  Award,
  Calendar,
  Coins,
  CreditCard,
  Gift,
  Home,
  MessageSquare,
  Star,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ZodError, z } from 'zod';

import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import { Card, CardContent } from '@/base/components/ui/card';
import { Label } from '@/base/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/base/components/ui/radio-group';
import { Select } from '@/base/components/ui/select';
import { Switch } from '@/base/components/ui/switch';
import { useUserProfile } from '@/base/hooks/use-userProfile';
import { userService } from '@/modules/users/services/user.service';
import { Gender, gender } from '@/modules/users/types';

export function UserProfile() {
  const { data: res } = useUserProfile();
  const user = res?.data;

  const [emailFrequency, setEmailFrequency] = useState('never');
  const [savePaymentInfo, setSavePaymentInfo] = useState(true);
  const [fullName, setFullName] = useState('');
  const [selectedGender, setSelectedGender] = useState<Gender | ''>('');
  const [isEditing, setIsEditing] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const passwordSchema = z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .nonempty('Mật khẩu không được để trống');
  const changePasswordSchema = z
    .object({
      currentPassword: passwordSchema,
      newPassword: passwordSchema,
      confirmNewPassword: passwordSchema,
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'Mật khẩu mới không trùng khớp',
      path: ['confirmNewPassword'],
    });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.fullName) {
      setFullName(user.fullName);
    }
    if (user?.gender) {
      setSelectedGender(user.gender);
    }
  }, [user]);
  const sidebarItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: Calendar, label: 'Đơn đặt chỗ của tôi', active: false },
    { icon: CreditCard, label: 'Tín nhiệm tự chế nghĩ', active: false },
    { icon: MessageSquare, label: 'Nhận xét', active: false },
    { icon: Star, label: 'AgodaVIP', active: false },
    { icon: Coins, label: 'Tiền Agoda', active: false },
    { icon: Gift, label: 'Thưởng hoàn tiền mặt', active: false },
    { icon: Award, label: 'PointsMAX', active: false },
    { icon: User, label: 'Hồ sơ', active: true },
  ];

  const subMenuItems = [
    { label: 'Thông tin người dùng', active: true },
    { label: 'Phương thức thanh toán', active: false },
    { label: 'Đăng ký nhận thư điện tử', active: false },
  ];
  const handleSave = async () => {
    try {
      const updateData: { fullName: string; gender?: Gender } = { fullName };
      if (selectedGender) {
        updateData.gender = selectedGender;
      }
      await userService.updateUserProfile(updateData);
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Lỗi cập nhật thông tin người dùng:', error);
      toast.error('Cập nhật thông tin thất bại. Vui lòng thử lại.');
    }
  };
  const handleChangePassword = async () => {
    // Thử validate input

    try {
      changePasswordSchema.parse({ currentPassword, newPassword, confirmNewPassword });

      // await userService.changePassword({
      //     currentPassword,
      //     newPassword,
      // });
      toast.success('Đổi mật khẩu thành công!');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0]?.message || 'Lỗi dữ liệu không hợp lệ');
      } else {
        setError('Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-white">
        <div className="p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div key={index}>
                <div
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    item.active
                      ? 'border-l-4 border-blue-600 bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>

                {item.active && (
                  <div className="mt-2 ml-8 space-y-1">
                    {subMenuItems.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className={`cursor-pointer rounded px-3 py-1 text-sm ${
                          subItem.active
                            ? 'font-medium text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {subItem.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900">Thông tin người dùng</h1>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-400">
                      <span className="text-2xl font-semibold text-white">H</span>
                    </div>
                    <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
                      <div>
                        <h3 className="font-semibold text-gray-900">Họ & Tên</h3>
                        {isEditing ? (
                          <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mt-1 w-full rounded border px-2 py-1 text-gray-800"
                            placeholder="Nhập họ và tên"
                          />
                        ) : (
                          <p className="text-gray-600">{user?.fullName}</p>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Giới tính</h3>
                        {isEditing ? (
                          <Select
                            value={selectedGender}
                            onChange={(value) => setSelectedGender(value as Gender)}
                            options={Object.entries(gender).map(([value, label]) => ({
                              value,
                              label,
                            }))}
                            placeholder="Chọn giới tính"
                            clearable={true}
                            searchable={false}
                            triggerClassName="mt-1 w-full"
                          />
                        ) : (
                          <p className="text-gray-600">
                            {user?.gender ? gender[user.gender] : 'Chưa cập nhật'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" onClick={handleSave}>
                        Lưu
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFullName(user?.fullName || '');
                          setSelectedGender(user?.gender || '');
                          setIsEditing(false);
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Email</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">{user?.email}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Đã xác nhận
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phone Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Số điện thoại</h4>
                <Button variant="link" className="p-0 text-blue-600">
                  Thêm
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              {!showPasswordForm ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1 font-medium text-gray-900">Mật khẩu</h4>
                    <div className="text-gray-400">••••••••••</div>
                  </div>
                  <Button
                    variant="link"
                    className="p-0 text-blue-600"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Chỉnh sửa
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                    <input
                      id="current-password"
                      type="password"
                      className="mt-1 w-full rounded border px-3 py-2"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Mật khẩu hiện tại"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <input
                      id="new-password"
                      type="password"
                      className="mt-1 w-full rounded border px-3 py-2"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mật khẩu mới"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="mt-1 w-full rounded border px-3 py-2"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu mới"
                    />
                  </div>
                  {/* Hiển thị lỗi validation nếu có */}
                  {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={() => setShowPasswordForm(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleChangePassword}>Lưu</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Phương thức thanh toán</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Lưu thông tin thẻ tín dụng của tôi</p>
                    <p className="mt-1 text-sm text-gray-500">Có</p>
                  </div>
                  <Switch checked={savePaymentInfo} onCheckedChange={setSavePaymentInfo} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Đăng ký nhận thư điện tử</h2>
            <Card>
              <CardContent className="p-6">
                <div>
                  <h4 className="mb-4 font-medium text-gray-900">Bản tin</h4>
                  <RadioGroup value={emailFrequency} onValueChange={setEmailFrequency}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">Hàng ngày</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="twice-weekly" id="twice-weekly" />
                      <Label htmlFor="twice-weekly">Hai lần một tuần</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">Hàng tuần</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="never" />
                      <Label htmlFor="never">Không bao</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

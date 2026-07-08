import { Form, Head } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

interface Props {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="nama@email.com"
                                    className="h-12 rounded-xl border-gray-200/60 bg-white/40 px-4 text-[14px] text-[#0f172a] placeholder:text-gray-400/80 shadow-sm shadow-gray-100/50 backdrop-blur-sm transition-all duration-200 focus-visible:border-[#2547F9]/40 focus-visible:bg-white/80 focus-visible:shadow-md focus-visible:shadow-[#2547F9]/5 focus-visible:ring-[2px] focus-visible:ring-[#2547F9]/10 dark:border-white/[0.06] dark:bg-slate-800/30 dark:text-[#f1f5f9] dark:placeholder:text-gray-500/60 dark:shadow-none dark:focus-visible:bg-slate-800/50"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                                        Kata Sandi
                                    </Label>
                                    {false && canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-[13px] font-medium text-[#2547F9] transition-colors duration-200 hover:text-[#1e3ce0]"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Kata sandi Anda"
                                    className="h-12 rounded-xl border-gray-200/60 bg-white/40 px-4 text-[14px] text-[#0f172a] placeholder:text-gray-400/80 shadow-sm shadow-gray-100/50 backdrop-blur-sm transition-all duration-200 focus-visible:border-[#2547F9]/40 focus-visible:bg-white/80 focus-visible:shadow-md focus-visible:shadow-[#2547F9]/5 focus-visible:ring-[2px] focus-visible:ring-[#2547F9]/10 dark:border-white/[0.06] dark:bg-slate-800/30 dark:text-[#f1f5f9] dark:placeholder:text-gray-500/60 dark:shadow-none dark:focus-visible:bg-slate-800/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="size-5 rounded-[6px] border-gray-300/70 transition-all duration-200 data-[state=checked]:border-[#2547F9] data-[state=checked]:bg-[#2547F9] dark:border-gray-600"
                                />
                                <Label htmlFor="remember" className="cursor-pointer text-[13px] text-gray-600 dark:text-gray-400">
                                    Ingat saya
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-12 w-full rounded-xl bg-[#2547F9] text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(37,71,249,0.3)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#1e3ce0] hover:shadow-[0_4px_12px_rgba(37,71,249,0.25)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                <LogIn size={17} strokeWidth={2} />
                                Masuk
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 rounded-xl border border-green-200/50 bg-green-50/50 p-3 text-center text-[13px] font-medium text-green-700 backdrop-blur-sm dark:border-green-900/20 dark:bg-green-900/10 dark:text-green-400">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk ke akun Anda',
    description: 'Masukkan email dan kata sandi untuk mengakses dashboard',
};

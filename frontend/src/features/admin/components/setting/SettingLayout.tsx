import React from 'react';

type SettingLayoutProps = {
    children: React.ReactNode;
};

const SettingLayout = ({ children }: SettingLayoutProps) => {
    return (
        <div className="space-y-6">
            <div className="border-b border-border pb-5 space-y-1">
                <h1 className="text-xl font-semibold text-foreground">Pengaturan</h1>
                <p className="text-sm text-muted-foreground">
                    Kelola preferensi dan konfigurasi aplikasi
                </p>
            </div>

            <div className="max-w-4xl">
                {children}
            </div>
        </div>
    );
};

export default SettingLayout;
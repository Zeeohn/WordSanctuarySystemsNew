import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { InstallationMemberStoreProvider } from "@/providers/AddMembersStoreProvider";
import { DepartmentMemberStoreProvider } from "@/providers/AddDeptMemberProvider";
import { AddDepartmentToCentralStoreProvider } from "@/providers/AddDepartmentToCentral.Provider";
import { ProfileStoreProvider } from "@/providers/ProfileStoreProvider";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Word Sanctuary Central Systems",
  description: "A Church that is Heaven. We have a mandate to take the World!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`m-0 p-0 antialiased`}>
        {/* the state used by add member component */}
        <ProfileStoreProvider> 
          <InstallationMemberStoreProvider>
            <DepartmentMemberStoreProvider>
              <AddDepartmentToCentralStoreProvider>
                {children}
              </AddDepartmentToCentralStoreProvider>
            </DepartmentMemberStoreProvider>
          </InstallationMemberStoreProvider>
        </ProfileStoreProvider>
        <Toaster />
      </body>
    </html>
  );
}

"use client";
import { ClerkProvider, SignIn, useAuth } from "@clerk/nextjs";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import LoadingLogo from "@/components/shared/LoadingLogo";

type Props = { children: React.ReactNode };

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

const convex = new ConvexReactClient(CONVEX_URL);

const ConvexClientProvider = ({ children }: Props) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading>
          <LoadingLogo />
        </AuthLoading>
        <Unauthenticated>
          <SignIn routing={"hash"} />
        </Unauthenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexClientProvider;

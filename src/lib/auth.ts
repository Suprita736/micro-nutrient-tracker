import { supabase } from "./supabaseClient";

export async function signUp(email: string, password: string) {

    return await supabase.auth.signUp({

        email,

        password,

    });

}

export async function login(email: string, password: string) {

    return await supabase.auth.signInWithPassword({

        email,

        password,

    });

}

export async function logout() {

    return await supabase.auth.signOut();

}
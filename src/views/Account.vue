<template>
  <div v-if="isAuthenticated" class="account">
    <div class="logout-container">
      <Button class="button logout" text="Se déconnecter" @click="handleLogout" />
    </div>
    <h1>Bienvenue sur votre compte !</h1>
    <form @submit.prevent="handleSave">
      <h2>Modifier vos informations personnelles</h2>
      <div class="form-element" :class="{ 'has-error': hasError('username') }">
        <label for="username">Nom d'utilisateur</label>
        <div class="input-container">
          <TextInput v-model="userInfo.username" placeholder="Nom d'utilisateur" class="text-input" :readonly="!isEditing.username" />
          <i v-if="!isEditing.username" class="fa-solid fa-pen edit-icon" @click="editField('username')"></i>
          <i v-else class="fa-solid fa-xmark cancel-icon" @click="cancelEdit('username')"></i>
        </div>
          <div v-if="getError('username')" class="error-message">{{ getError('username') }}</div>
      </div>

      <div class="form-element" :class="{ 'has-error': hasError('email') }">
        <label for="email">Email</label>
        <div class="input-container">
          <TextInput v-model="userInfo.email" type="email" placeholder="Email" class="text-input" :readonly="!isEditing.email" />
          <i v-if="!isEditing.email" class="fa-solid fa-pen edit-icon" @click="editField('email')"></i>
          <i v-else class="fa-solid fa-xmark cancel-icon" @click="cancelEdit('email')"></i>
        </div>
        <div v-if="getError('email')" class="error-message">{{ getError('email') }}</div>
      </div>

      <a @click="togglePasswordChange" class="change-password-link">
        Modifier le mot de passe
        <i :class="showPasswordChange ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
      </a>

      <div v-if="showPasswordChange">
        <div class="form-element" :class="{ 'has-error': hasError('currentPassword') }">
          <label for="currentPassword">Mot de passe actuel</label>
          <div class="input-container">
          <TextInput v-model="passwords.currentPassword" type="password" placeholder="Mot de passe actuel" class="text-input" />
          </div>
          <div v-if="getError('currentPassword')" class="error-message">{{ getError('currentPassword') }}</div>
        </div>
        <div class="form-element" :class="{ 'has-error': hasError('password') }">
          <label for="newPassword">Nouveau mot de passe</label>
          <div class="input-container">
          <TextInput v-model="passwords.newPassword" type="password" placeholder="Nouveau mot de passe" class="text-input" />
          </div>
          <div v-if="getError('password')" class="error-message">{{ getError('password') }}</div>
        </div>
        <div class="form-element" :class="{ 'has-error': hasError('confirmNewPassword') || hasError('password') }">
          <label for="confirmNewPassword">Confirmer le nouveau mot de passe</label>
          <div class="input-container">
          <TextInput v-model="passwords.confirmNewPassword" type="password" placeholder="Confirmer le nouveau mot de passe" class="text-input" />
          </div>
          <div v-if="getError('confirmNewPassword')" class="error-message">{{ getError('confirmNewPassword') }}</div>
        </div>
      </div>
      <div class="form-element buttons">
        <Button v-if="hasChanges" class="button" text="Enregistrer les modifications" type="submit" />
      </div>
    </form>


    <a @click="toggleDelete" class="delete-account">
      Supprimer votre compte
      <i :class="showDelete ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
    </a>
    <div v-if="showDelete">
      <form @submit.prevent="handleDeleteAccount">
        <div class="form-element" :class="{ 'has-error': hasError('deletePassword') }">
          <label for="deletePassword">Mot de passe</label>
          <div class="input-container">
          <TextInput v-model="deletePasswords.password" type="password" placeholder="Mot de passe" class="text-input" />
          </div>
          <div v-if="getError('deletePassword')" class="error-message">{{ getError('deletePassword') }}</div>
        </div>
        <div class="form-element" :class="{ 'has-error': hasError('confirmDeletePassword') }">
          <label for="confirmDeletePassword">Confirmer le mot de passe</label>
          <div class="input-container">
          <TextInput v-model="deletePasswords.confirmPassword" type="password" placeholder="Confirmer le mot de passe" class="text-input" />
          </div>
          <div v-if="getError('confirmDeletePassword')" class="error-message">{{ getError('confirmDeletePassword') }}</div>
        </div>
        <div class="form-element buttons">
          <Button v-if="hasDeleteChanges" class="button delete" text="Supprimer le compte" type="submit" />
        </div>
      </form>
    </div>
  </div>
  <ConnectionLanding activeIcon="fa-solid fa-user" v-else />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ConnectionLanding from '../components/ConnectionLanding.vue'
import Button from '../components/Button.vue'
import TextInput from '../components/TextInput.vue'
import { setDefaultHeaders } from '../composables/useFetchApi'
import { isAuthenticated, user, token } from '../store/user'
import { useFetchApiCrud } from '../composables/useFetchApiCrud'

const router = useRouter()

const isEditing = ref({
  username: false,
  email: false
})

const userInfo = ref({
  username: user.value?.username || '',
  email: user.value?.email || ''
})

const originalUserInfo = ref({ ...userInfo.value })

const passwords = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const deletePasswords = ref({
  password: '',
  confirmPassword: ''
})

const authApi = useFetchApiCrud('users/login', import.meta.env.VITE_API_URL)
const errors = ref([])

const showPasswordChange = ref(false)
const showDelete = ref(false)

const hasChanges = computed(() => {
  const passwordsFilled =
    passwords.value.currentPassword &&
    passwords.value.newPassword &&
    passwords.value.confirmNewPassword;

  const passwordsEmpty =
    !passwords.value.currentPassword &&
    !passwords.value.newPassword &&
    !passwords.value.confirmNewPassword;

  const usernameChanged = userInfo.value.username !== originalUserInfo.value.username;
  const emailChanged = userInfo.value.email !== originalUserInfo.value.email;

  return (
    passwordsFilled || // Tous les champs de mot de passe sont remplis (on modifie le mot de passe)
    (passwordsEmpty && (usernameChanged || emailChanged)) // Aucun champ de mot de passe n'est rempli et au moins un autre champ est modifié
  );
});

const hasDeleteChanges = computed(() => {
  return deletePasswords.value.password || deletePasswords.value.confirmPassword
})

function togglePasswordChange() {
  showPasswordChange.value = !showPasswordChange.value
  if (!showPasswordChange.value) {
    passwords.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' }
  }
}

function toggleDelete() {
  showDelete.value = !showDelete.value
  if (!showDelete.value) {
    deletePasswords.value = {
      password: '',
      confirmPassword: ''
    }
  }
}


function handleLogout() {
  isAuthenticated.value = false
  user.value = null
  setDefaultHeaders({ Authorization: '' })
  router.push('/')
}

async function verifyPassword(password, field) {
  try {
    const response = await authApi.fetchApi({
      url: 'users/login',
      data: {
        email: originalUserInfo.value.email,
        password: password
      },
      method: 'POST'
    })

    return response?.token
  } catch (e) {
    if (e.data?.errors) {
      errors.value = e.data.errors.map(err => ({
        field: field,
        msg: err.msg
      }))
    } else {
      errors.value = [{
        field: field,
        msg: 'Mot de passe incorrect.'
      }]
    }
    return null
  }
}

async function handleSave() {


  if (passwords.value.newPassword && !passwords.value.currentPassword) {
    errors.value = [{ 
      field: 'currentPassword', 
      msg: 'Veuillez entrer votre mot de passe actuel.' 
    }]
    return
  }

  if (passwords.value.newPassword) {
    const validPassword = await verifyPassword(passwords.value.currentPassword, 'currentPassword')
    if (!validPassword) {
      errors.value = [{ field: 'currentPassword', msg: 'Mot de passe incorrect.' }]
      return
    }
  }


  if (passwords.value.newPassword && !passwords.value.confirmNewPassword) {
  errors.value = [{ 
    field: 'confirmNewPassword', 
    msg: 'Veuillez confirmer votre nouveau mot de passe.' 
  }]
  return
}

if (!passwords.value.newPassword && passwords.value.confirmNewPassword) {
  errors.value = [{ 
    field: 'newPassword', 
    msg: 'Veuillez entrer votre nouveau mot de passe.' 
  }]
  return
}

  // Vérifier les mots de passe s'ils sont différents
  if (passwords.value.newPassword && passwords.value.newPassword !== passwords.value.confirmNewPassword) {
    errors.value = [{ field: 'confirmNewPassword', msg: 'Les mots de passe ne correspondent pas.' }]
    return
  }


  const updates = {}
  if (userInfo.value.username !== originalUserInfo.value.username) updates.username = userInfo.value.username
  if (userInfo.value.email !== originalUserInfo.value.email) updates.email = userInfo.value.email
  if (passwords.value.newPassword) updates.password = passwords.value.newPassword

  try {
  const response = await fetch('/api/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erreur lors de la mise à jour:', errorData);

    // Stocker les erreurs dans un format compatible avec getError
    if (errorData.errors) {
      errors.value = errorData.errors.map(err => ({
        field: err.field,
        msg: err.msg,
      }));
    } else {
      errors.value = [{ field: 'global', msg: 'Une erreur est survenue.' }];
    }
    return;
  }

  const data = await response.json();
  user.value.username = data.user.username;
  user.value.email = data.user.email;

  resetState();
} catch (error) {
  console.error('Erreur lors de la mise à jour:', error);
  errors.value = [{ field: 'global', msg: 'Erreur lors de la mise à jour des informations utilisateur.' }];
}
}

async function handleDeleteAccount(deletePasswords) {
  if (deletePasswords.value.password !== deletePasswords.value.confirmPassword) {
    errors.value = [{ field: 'confirmDeletePassword', msg: 'Les mots de passe ne correspondent pas.' }]
    return
  }

  if (deletePasswords.value.password) {
    const token = await verifyPassword(deletePasswords.value.password, 'deletePassword')
    if (!token) return
  }


  try {

    await fetch('/api/users/me', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${response.token}`
      }
    })

    handleLogout()
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error)
    errors.value = [{ field: 'global', msg: 'Erreur lors de la suppression du compte.' }]
  }
}


function resetState() {
  isEditing.value = { username: false, email: false }
  originalUserInfo.value = { ...userInfo.value }
  passwords.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' }
  showPasswordChange.value = false
  errors.value = []
}

function cancelEdit(field) {
  userInfo.value[field] = originalUserInfo.value[field]
  isEditing.value[field] = false
  errors.value = errors.value.filter(error => error.field !== field)
}

function editField(field) {
  isEditing.value[field] = true
}

function hasError(field) {
  return errors.value.some(error => error.field === field)
}

function getError(field) {
  const error = errors.value.find(error => error.field === field);
  return error ? error.msg : null;
}
</script>


<style scoped>


.logout-container {
  display: flex;
  justify-content: flex-end;
}

.logout {
  display: flex;
  justify-content: flex-end;
}

h2 {
  color: var(--text-color);
}

.change-password-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  /* Espace entre le texte et l'icône */
  margin-bottom: 1.5rem;
  /* Augmente l'espace sous le lien */
  cursor: pointer;
  text-decoration: none;
}

.delete {
  background-color: var(--error);
}

.delete:hover {
  background-color: var(--error-dark);
}

.delete-account {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  /* Espace entre le texte et l'icône */
  margin-bottom: 1.5rem;
  /* Augmente l'espace sous le lien */
  cursor: pointer;
  text-decoration: none;
  color:var(--error);
  font-size: 2rem;
  font-family: var(--sen-bold); /* Utiliser la police de caractères personnalisée */
    font-weight: var(--bold);

}

.delete-account:hover {
  color: var(--error-dark);
}

.input-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-around;
}

.text-input[readonly] {
  background-color: #f0f0f0;
  color: #999;
}

.text-input[readonly]:focus {
  border-color: #ccc;
}

.form-element {
  margin-bottom: 1.5rem;
}

label {
  margin-left: 1rem;
}

.error-message {
    color: var(--error);
    margin-left: 1rem;
}
</style>

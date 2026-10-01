import { useAuth } from '../../hooks/useAuth';
import { TopBar } from '../../components/layout/TopBar';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { MapPin, Globe, Plane, LogOut, Settings, Edit3 } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  // Mock stats
  const stats = {
    totalTrips: 12,
    countriesVisited: 5,
    citiesVisited: 12,
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-surface-2-dark">
      <TopBar 
        title="Profile" 
        rightElement={
          <button className="p-2 -mr-2 rounded-full hover:bg-surface-2 dark:hover:bg-surface-2-dark">
            <Settings className="w-6 h-6 text-text" />
          </button>
        }
      />

      <div className="bg-surface dark:bg-surface-dark pb-6 border-b border-border dark:border-border-dark">
        <div className="px-4 mt-6 flex flex-col items-center text-center">
          <div className="relative">
            <Avatar 
              src={user?.avatarUrl} 
              fallback={user?.displayName || user?.username || '?'} 
              className="w-24 h-24 text-2xl mb-4 border-4 border-surface dark:border-surface-dark shadow-md"
            />
            <button className="absolute bottom-4 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md border-2 border-surface dark:border-surface-dark hover:bg-primary-dark transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          
          <h2 className="font-display text-2xl font-semibold">{user?.displayName || user?.username}</h2>
          <p className="text-text-muted dark:text-text-muted-dark font-medium mb-3">@{user?.username}</p>
          
          {user?.bio ? (
            <p className="text-sm px-6 text-text-muted dark:text-text-muted-dark">{user.bio}</p>
          ) : (
            <p className="text-sm px-6 text-text-muted dark:text-text-muted-dark italic">No bio added yet.</p>
          )}

          <div className="mt-6 w-full flex gap-3 px-6">
            <Button variant="outline" fullWidth className="h-10">Edit Profile</Button>
            <Button variant="outline" fullWidth className="h-10" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 bg-surface dark:bg-surface-dark mt-2 border-y border-border dark:border-border-dark flex-1">
        <h3 className="font-semibold mb-6">Travel Stats</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-2 dark:bg-surface-2-dark rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Plane className="w-5 h-5" />
            </div>
            <span className="text-2xl font-display font-semibold">{stats.totalTrips}</span>
            <span className="text-xs text-text-muted dark:text-text-muted-dark mt-1 font-medium">Trips</span>
          </div>
          
          <div className="bg-surface-2 dark:bg-surface-2-dark rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-2xl font-display font-semibold">{stats.countriesVisited}</span>
            <span className="text-xs text-text-muted dark:text-text-muted-dark mt-1 font-medium">Countries</span>
          </div>
          
          <div className="bg-surface-2 dark:bg-surface-2-dark rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-2xl font-display font-semibold">{stats.citiesVisited}</span>
            <span className="text-xs text-text-muted dark:text-text-muted-dark mt-1 font-medium">Cities</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit, Save, X, MapPin, Mail, Phone, Briefcase, GraduationCap,
  Award, ExternalLink, Plus, Trash2, Github, Linkedin, Globe, ArrowLeft, Star, Upload, Camera,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '', middleName: (user as any)?.middleName || '', lastName: user?.lastName || '',
    email: user?.email || '', contactNo: user?.contactNo || '', bio: (user as any)?.bio || '',
    location: (user as any)?.location || '', portfolio: (user as any)?.portfolio || '',
    github: (user as any)?.github || '', linkedin: (user as any)?.linkedin || '',
    leetcode: (user as any)?.leetcode || '', cgpa: (user as any)?.cgpa || '',
    skills: user?.skills || [], projects: user?.projects || [], achievements: user?.achievements || [],
    resumeUrl: (user as any)?.resumeUrl || '', coverLetter: (user as any)?.coverLetter || '',
    // Academic / professional fields
    rollNumber: (user as any)?.rollNumber || '',
    department: (user as any)?.department || '',
    yearOfGraduation: (user as any)?.yearOfGraduation || '',
    employeeId: (user as any)?.employeeId || '',
    designation: (user as any)?.designation || '',
    qualification: (user as any)?.qualification || '',
    specialization: (user as any)?.specialization || [],
    totalExperience: (user as any)?.totalExperience || '',
    teachingExperience: (user as any)?.teachingExperience || '',
    industryExperience: (user as any)?.industryExperience || '',
  });
  const [newSkill, setNewSkill] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      return;
    }
    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);
    await updateProfile({ profilePicture: `${publicUrl}?t=${Date.now()}` });
    toast({ title: 'Photo updated', description: 'Your profile picture has been changed.' });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/cover.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      return;
    }
    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);
    await updateProfile({ coverPhoto: `${publicUrl}?t=${Date.now()}` });
    toast({ title: 'Cover photo updated', description: 'Your cover photo has been changed.' });
  };

  const handleRemoveCover = async () => {
    if (!user?.id) return;
    await updateProfile({ coverPhoto: '' });
    toast({ title: 'Cover photo removed' });
  };

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '', skills: [] as string[] });
  const [newProjectSkills, setNewProjectSkills] = useState('');
  const [newAchievement, setNewAchievement] = useState({ title: '', description: '', date: '', issuer: '' });
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;

    setFormData({
      firstName: user.firstName || '',
      middleName: user.middleName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      contactNo: user.contactNo || '',
      bio: user.bio || '',
      location: user.location || '',
      portfolio: user.portfolio || '',
      github: user.github || '',
      linkedin: user.linkedin || '',
      leetcode: user.leetcode || '',
      cgpa: user.cgpa || '',
      skills: user.skills || [],
      projects: user.projects || [],
      achievements: user.achievements || [],
      resumeUrl: user.resumeUrl || '',
      coverLetter: user.coverLetter || '',
      // Academic / professional
      rollNumber: (user as any).rollNumber || '',
      department: (user as any).department || '',
      yearOfGraduation: (user as any).yearOfGraduation || '',
      employeeId: (user as any).employeeId || '',
      designation: (user as any).designation || '',
      qualification: (user as any).qualification || '',
      specialization: (user as any).specialization || [],
      totalExperience: (user as any).totalExperience || '',
      teachingExperience: (user as any).teachingExperience || '',
      industryExperience: (user as any).industryExperience || '',
    });
  }, [user]);

  const toggleEdit = (s: string) => setEditingSections(prev => ({ ...prev, [s]: !prev[s] }));

  const handleSave = async (section: string) => {
    try {
      await updateProfile(formData as any);
      toggleEdit(section);
      toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
      setTimeout(() => window.dispatchEvent(new Event('profileUpdated')), 100);
    } catch { toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' }); }
  };

  const normalizeSkills = (skills: any) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.filter(Boolean).map((skill) => String(skill).trim());
    return String(skills).split(',').map((skill) => skill.trim()).filter(Boolean);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };



  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setNewProject({
      title: project.title || '',
      description: project.description || '',
      link: project.link || '',
      skills: normalizeSkills(project.skills),
    });
    setNewProjectSkills(normalizeSkills(project.skills).join(', '));
    setProjectDialogOpen(true);
  };

  const handleEditAchievement = (achievement: any) => {
    setEditingAchievement(achievement);
    setNewAchievement({ title: achievement.title, description: achievement.description, date: achievement.date, issuer: achievement.issuer });
    setAchievementDialogOpen(true);
  };

  const handleSaveProject = async () => {
    if (!newProject.title.trim()) return;
    const normalizedSkills = normalizeSkills(newProjectSkills);
    let updatedProjects;
    if (editingProject) {
      updatedProjects = (formData.projects || []).map((p: any) =>
        p.id === editingProject.id
          ? { ...editingProject, ...newProject, skills: normalizedSkills }
          : p
      );
    } else {
      const proj = { id: `proj_${Date.now()}`, ...newProject, skills: normalizedSkills };
      updatedProjects = [...(formData.projects || []), proj];
    }
    setFormData(p => ({ ...p, projects: updatedProjects }));
    try {
      await updateProfile({ projects: updatedProjects } as any);
      toast({ title: editingProject ? 'Project updated' : 'Project added', description: 'Saved to profile.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save project', variant: 'destructive' });
    }
    setProjectDialogOpen(false);
    setNewProject({ title: '', description: '', link: '', skills: [] });
    setNewProjectSkills('');
    setEditingProject(null);
  };

  const handleSaveAchievement = async () => {
    if (!newAchievement.title.trim()) return;
    let updatedAchievements;
    if (editingAchievement) {
      updatedAchievements = (formData.achievements || []).map((a: any) => a.id === editingAchievement.id ? { ...editingAchievement, ...newAchievement } : a);
    } else {
      const ach = { id: `ach_${Date.now()}`, ...newAchievement };
      updatedAchievements = [...(formData.achievements || []), ach];
    }
    setFormData(p => ({ ...p, achievements: updatedAchievements }));
    try {
      await updateProfile({ achievements: updatedAchievements } as any);
      toast({ title: editingAchievement ? 'Achievement updated' : 'Achievement added', description: 'Saved to profile.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save achievement', variant: 'destructive' });
    }
    setAchievementDialogOpen(false);
    setNewAchievement({ title: '', description: '', date: '', issuer: '' });
    setEditingAchievement(null);
  };

  const handleEnableProfileEditing = () => {
    setEditingSections(prev => ({
      ...prev,
      header: true,
      contact: true,
      social: true,
      skills: true,
      about: true,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) { navigate('/login'); return null; }

  const detailItems = [
    user.role === 'student' && user.rollNumber ? { label: 'Roll Number', value: user.rollNumber } : null,
    user.role === 'student' && user.department ? { label: 'Department', value: user.department } : null,
    user.role === 'student' && user.yearOfGraduation ? { label: 'Graduation Year', value: String(user.yearOfGraduation) } : null,
    user.role === 'student' && user.experience ? { label: 'Experience', value: user.experience } : null,
    user.role === 'faculty' && user.employeeId ? { label: 'Employee ID', value: user.employeeId } : null,
    user.role === 'faculty' && user.designation ? { label: 'Designation', value: user.designation } : null,
    user.role === 'faculty' && user.dateOfJoining ? { label: 'Date of Joining', value: new Date(user.dateOfJoining).toLocaleDateString() } : null,
    user.role === 'faculty' && user.qualification ? { label: 'Qualification', value: user.qualification } : null,
    user.role === 'faculty' && user.specialization?.length ? { label: 'Specialization', value: user.specialization.join(', ') } : null,
    user.role === 'faculty' && user.totalExperience !== undefined ? { label: 'Total Experience', value: `${user.totalExperience} years` } : null,
    user.role === 'faculty' && user.teachingExperience !== undefined ? { label: 'Teaching Experience', value: `${user.teachingExperience} years` } : null,
    user.role === 'faculty' && user.industryExperience !== undefined ? { label: 'Industry Experience', value: `${user.industryExperience} years` } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const documentItems = [
    formData.resumeUrl ? { label: 'Resume', href: formData.resumeUrl } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  const EditButton = ({ section }: { section: string }) => (
    <button onClick={() => toggleEdit(section)} className="p-1 rounded hover:bg-muted"><Edit size={16} className="text-muted-foreground" /></button>
  );

  const SaveCancelButtons = ({ section }: { section: string }) => (
    <div className="flex gap-2 mt-2">
      <Button size="sm" onClick={() => handleSave(section)} className="bg-united-green hover:bg-united-green/90 text-white"><Save size={14} className="mr-1" /> Save</Button>
      <Button size="sm" variant="outline" onClick={() => toggleEdit(section)}><X size={14} className="mr-1" /> Cancel</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Back */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="my-2 text-muted-foreground">
            <ArrowLeft size={18} className="mr-1" /> Back
          </Button>
        </div>
      </div>

      {/* Cover */}
      <div className="h-48 md:h-60 relative group">
        {user.coverPhoto ? (
          <img src={user.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-accent to-accent/70" />
        )}
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {user.coverPhoto && (
            <button
              onClick={handleRemoveCover}
              className="bg-destructive/80 backdrop-blur-sm text-destructive-foreground rounded-lg px-3 py-1.5 text-sm font-medium shadow-md flex items-center gap-1.5 hover:bg-destructive"
            >
              <Trash2 size={14} /> Remove
            </button>
          )}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="bg-background/80 backdrop-blur-sm text-foreground rounded-lg px-3 py-1.5 text-sm font-medium shadow-md flex items-center gap-1.5 hover:bg-background"
          >
            <Camera size={14} /> {user.coverPhoto ? 'Change cover' : 'Add cover'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative">
        {/* Header Card */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-card shadow-lg">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                </Avatar>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors"
                >
                  <Camera size={14} />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                {editingSections.header ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="First Name" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                      <Input placeholder="Middle Name" value={formData.middleName} onChange={e => setFormData({ ...formData, middleName: e.target.value })} />
                      <Input placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                    {user.role === 'student' && (
                      <Input placeholder="CGPA" type="number" value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} />
                    )}
                    <SaveCancelButtons section="header" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                      <h1 className="text-2xl font-bold text-foreground">{user.firstName} {(user as any).middleName} {user.lastName}</h1>
                      <EditButton section="header" />
                    </div>
                    <div className="flex gap-1.5 flex-wrap justify-center md:justify-start mb-2">
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        {user.role === 'student' ? <><GraduationCap size={12} className="mr-1" /> Student</> : <><Briefcase size={12} className="mr-1" /> Faculty</>}
                      </Badge>
                      {user.role === 'student' && (user as any).department && <Badge variant="secondary">{(user as any).department}</Badge>}
                      {user.role === 'student' && formData.cgpa && <Badge variant="outline" className="bg-united-amber/10 text-united-amber border-united-amber/30"><Star size={12} className="mr-1" /> CGPA: {formData.cgpa}</Badge>}
                      {user.role === 'faculty' && (user as any).designation && <Badge variant="secondary">{(user as any).designation}</Badge>}
                    </div>
                    {formData.location && <p className="text-sm text-foreground/90 flex items-center gap-1 justify-center md:justify-start"><MapPin size={14} /> {formData.location}</p>}
                  </>
                )}
              </div>
              <Button type="button" onClick={handleEnableProfileEditing} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Edit size={16} className="mr-1" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Contact */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-foreground">Contact Information</h2>
                  {!editingSections.contact && <EditButton section="contact" />}
                </div>
                {editingSections.contact ? (
                  <div className="space-y-2">
                    <div className="relative"><Mail size={14} className="absolute left-3 top-3 text-muted-foreground" /><Input className="pl-9" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                    <div className="relative"><Phone size={14} className="absolute left-3 top-3 text-muted-foreground" /><Input className="pl-9" value={formData.contactNo} onChange={e => setFormData({ ...formData, contactNo: e.target.value })} /></div>
                    <div className="relative"><MapPin size={14} className="absolute left-3 top-3 text-muted-foreground" /><Input className="pl-9" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
                    <SaveCancelButtons section="contact" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-foreground/90 flex items-center gap-2"><Mail size={14} /> {user.email}</p>
                    {user.contactNo && <p className="text-sm text-foreground/90 flex items-center gap-2"><Phone size={14} /> {user.contactNo}</p>}
                    {formData.location && <p className="text-sm text-foreground/90 flex items-center gap-2"><MapPin size={14} /> {formData.location}</p>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-foreground">Social Links</h2>
                  {!editingSections.social && <EditButton section="social" />}
                </div>
                {editingSections.social ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <Globe size={14} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Portfolio URL"
                        value={formData.portfolio}
                        onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <Github size={14} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="GitHub URL"
                        value={formData.github}
                        onChange={e => setFormData({ ...formData, github: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <Linkedin size={14} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="LinkedIn URL"
                        value={formData.linkedin}
                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <Award size={14} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="LeetCode URL"
                        value={formData.leetcode}
                        onChange={e => setFormData({ ...formData, leetcode: e.target.value })}
                      />
                    </div>
                    <SaveCancelButtons section="social" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.portfolio && <a href={formData.portfolio} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded border border-border hover:bg-muted text-sm"><span className="flex items-center gap-2"><Globe size={14} /> Portfolio</span><ExternalLink size={12} /></a>}
                    {formData.github && <a href={formData.github} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded border border-border hover:bg-muted text-sm"><span className="flex items-center gap-2"><Github size={14} /> GitHub</span><ExternalLink size={12} /></a>}
                    {formData.linkedin && <a href={formData.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded border border-border hover:bg-muted text-sm"><span className="flex items-center gap-2"><Linkedin size={14} /> LinkedIn</span><ExternalLink size={12} /></a>}
                    {formData.leetcode && <a href={formData.leetcode} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded border border-border hover:bg-muted text-sm"><span className="flex items-center gap-2"><Award size={14} /> LeetCode</span><ExternalLink size={12} /></a>}
                    {!formData.portfolio && !formData.github && !formData.linkedin && !formData.leetcode && (
                      <p className="text-sm text-foreground/80 text-center py-3">No social links added yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-foreground">Skills</h2>
                  {!editingSections.skills && <EditButton section="skills" />}
                </div>
                {editingSections.skills ? (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      <Input placeholder="Add a skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()} />
                      <Button size="sm" onClick={handleAddSkill}><Plus size={14} /></Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="pr-1">
                          {skill} <button onClick={() => setFormData(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))} className="ml-1"><X size={12} /></button>
                        </Badge>
                      ))}
                    </div>
                    <SaveCancelButtons section="skills" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.length > 0 ? formData.skills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-primary border-primary/30">{skill}</Badge>
                    )) : <p className="text-sm text-foreground/80">No skills added yet</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-4">
            {/* About */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-foreground">About</h2>
                  {!editingSections.about && <EditButton section="about" />}
                </div>
                {editingSections.about ? (
                  <div className="space-y-2">
                    <Textarea rows={4} placeholder="Tell us about yourself..." value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                    <SaveCancelButtons section="about" />
                  </div>
                ) : (
                  <p className="text-sm text-foreground/90 whitespace-pre-line">{formData.bio || 'No bio added yet. Click edit to add your bio.'}</p>
                )}
              </CardContent>
            </Card>

            {(detailItems.length > 0 || formData.coverLetter) && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="font-semibold text-foreground">Academic & Professional Details</h2>
                      {!editingSections.academic && <EditButton section="academic" />}
                    </div>
                    {editingSections.academic ? (
                      <div className="space-y-3">
                        {user.role === 'student' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg border border-border p-3"><Label>Roll Number</Label><Input value={formData.rollNumber || ''} onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} /></div>
                            <div className="rounded-lg border border-border p-3"><Label>Department</Label><Input value={formData.department || ''} onChange={e => setFormData({ ...formData, department: e.target.value })} /></div>
                            <div className="rounded-lg border border-border p-3"><Label>Graduation Year</Label><Input type="number" inputMode="numeric" value={formData.yearOfGraduation || ''} onChange={e => setFormData({ ...formData, yearOfGraduation: e.target.value })} /></div>
                            <div className="rounded-lg border border-border p-3"><Label>CGPA</Label><Input type="number" step="0.01" value={formData.cgpa || ''} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} /></div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg border border-border p-3"><Label>Employee ID</Label><Input value={formData.employeeId || ''} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} /></div>
                            <div className="rounded-lg border border-border p-3"><Label>Designation</Label><Input value={formData.designation || ''} onChange={e => setFormData({ ...formData, designation: e.target.value })} /></div>
                            <div className="rounded-lg border border-border p-3"><Label>Qualification</Label><Input value={formData.qualification || ''} onChange={e => setFormData({ ...formData, qualification: e.target.value })} /></div>
                            <div className="rounded-lg border border-border p-3"><Label>Specialization (comma separated)</Label><Input value={(formData.specialization || []).join(', ')} onChange={e => setFormData({ ...formData, specialization: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} /></div>
                          </div>
                        )}
                        <SaveCancelButtons section="academic" />
                      </div>
                    ) : (
                      detailItems.length > 0 && (
                        <div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {detailItems.map((item) => (
                              <div key={item.label} className="rounded-lg border border-border p-3">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                                <p className="mt-1 font-medium text-foreground">{item.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {formData.coverLetter && (
                    <div>
                      <h2 className="font-semibold text-foreground mb-2">Cover Letter</h2>
                      <p className="text-sm text-foreground/90 whitespace-pre-line">{formData.coverLetter}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {documentItems.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-semibold text-foreground mb-3">Documents</h2>
                  <div className="flex flex-wrap gap-2">
                    {documentItems.map((item) => (
                      <Button key={item.label} variant="outline" size="sm" asChild>
                        <a href={item.href} target="_blank" rel="noreferrer">
                          {item.label}
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projects */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-foreground">Projects</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setNewProject({ title: '', description: '', link: '', skills: [] });
                      setNewProjectSkills('');
                      setEditingProject(null);
                      setProjectDialogOpen(true);
                    }}
                  ><Plus size={14} className="mr-1" /> Add Project</Button>
                </div>
                {formData.projects.length > 0 ? (
                  <div className="space-y-3">
                    {formData.projects.map((project: any) => (
                      <div key={project.id} className="p-3 rounded-lg border border-border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm text-foreground">{project.title}</h3>
                            <p className="text-xs text-foreground/85 mt-1">{project.description}</p>
                            {normalizeSkills(project.skills).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {normalizeSkills(project.skills).map((s: string) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                              </div>
                            )}
                            {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1">View Project <ExternalLink size={10} /></a>}
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => handleEditProject(project)} className="text-muted-foreground hover:bg-muted p-1 rounded"><Edit size={14} /></button>
                            <button onClick={async () => {
                              const updated = (formData.projects || []).filter((pr: any) => pr.id !== project.id);
                              setFormData(p => ({ ...p, projects: updated }));
                              try {
                                await updateProfile({ projects: updated } as any);
                                toast({ title: 'Project removed' });
                              } catch {
                                toast({ title: 'Error', description: 'Failed to remove project', variant: 'destructive' });
                              }
                            }} className="text-destructive hover:bg-destructive/10 p-1 rounded"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-foreground/80">No projects added yet.</p>}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-foreground">Achievements & Awards</h2>
                  <Button size="sm" variant="outline" onClick={() => setAchievementDialogOpen(true)}><Plus size={14} className="mr-1" /> Add Achievement</Button>
                </div>
                {formData.achievements.length > 0 ? (
                  <div className="space-y-2">
                    {formData.achievements.map((a: any) => (
                      <div key={a.id} className="flex justify-between items-start gap-4 p-3 rounded-lg border border-border">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-foreground flex items-center gap-1 break-words"><Award size={14} className="text-united-amber" /> {a.title}</h3>
                          {a.description && <p className="text-xs text-foreground/85 mt-0.5 break-words whitespace-pre-wrap">{a.description}</p>}
                          {(a.issuer || a.date) && <p className="text-xs text-foreground/75 mt-0.5 break-words">{a.issuer}{a.issuer && a.date ? ' • ' : ''}{a.date}</p>}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => handleEditAchievement(a)} className="text-muted-foreground hover:bg-muted p-1 rounded"><Edit size={14} /></button>
                          <button onClick={async () => {
                            const updated = (formData.achievements || []).filter((ac: any) => ac.id !== a.id);
                            setFormData(p => ({ ...p, achievements: updated }));
                            try {
                              await updateProfile({ achievements: updated } as any);
                              toast({ title: 'Achievement removed' });
                            } catch {
                              toast({ title: 'Error', description: 'Failed to remove achievement', variant: 'destructive' });
                            }
                          }} className="text-destructive hover:bg-destructive/10 p-1 rounded"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-foreground/80">No achievements added yet.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Project Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={(open) => {
        setProjectDialogOpen(open);
        if (!open) {
          setNewProject({ title: '', description: '', link: '', skills: [] });
          setEditingProject(null);
        }
      }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label htmlFor="project-title">Title</Label><Input id="project-title" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} /></div>
            <div><Label htmlFor="project-desc">Description</Label><Textarea id="project-desc" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} /></div>
            <div><Label htmlFor="project-link">Link</Label><Input id="project-link" value={newProject.link} onChange={e => setNewProject({ ...newProject, link: e.target.value })} placeholder="https://..." /></div>
            <div>
              <Label htmlFor="project-skills">Skills (comma separated)</Label>
              <Input id="project-skills" value={newProjectSkills} onChange={e => setNewProjectSkills(e.target.value)} placeholder="React, Node.js, etc." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setProjectDialogOpen(false);
              setNewProject({ title: '', description: '', link: '', skills: [] });
              setNewProjectSkills('');
              setEditingProject(null);
            }}>Cancel</Button>
            <Button onClick={handleSaveProject} className="bg-accent text-accent-foreground">{editingProject ? 'Update Project' : 'Add Project'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Achievement Dialog */}
      <Dialog open={achievementDialogOpen} onOpenChange={(open) => {
        setAchievementDialogOpen(open);
        if (!open) {
          setNewAchievement({ title: '', description: '', date: '', issuer: '' });
          setEditingAchievement(null);
        }
      }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingAchievement ? 'Edit Achievement' : 'Add Achievement'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label htmlFor="ach-title">Title</Label><Input id="ach-title" value={newAchievement.title} onChange={e => setNewAchievement({ ...newAchievement, title: e.target.value })} /></div>
            <div><Label htmlFor="ach-desc">Description</Label><Textarea id="ach-desc" value={newAchievement.description} onChange={e => setNewAchievement({ ...newAchievement, description: e.target.value })} /></div>
            <div><Label htmlFor="ach-issuer">Issuer</Label><Input id="ach-issuer" value={newAchievement.issuer} onChange={e => setNewAchievement({ ...newAchievement, issuer: e.target.value })} /></div>
            <div><Label htmlFor="ach-date">Date</Label><Input id="ach-date" type="date" value={newAchievement.date} onChange={e => setNewAchievement({ ...newAchievement, date: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAchievementDialogOpen(false);
              setNewAchievement({ title: '', description: '', date: '', issuer: '' });
              setEditingAchievement(null);
            }}>Cancel</Button>
            <Button onClick={handleSaveAchievement} className="bg-accent text-accent-foreground">{editingAchievement ? 'Update Achievement' : 'Add Achievement'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;

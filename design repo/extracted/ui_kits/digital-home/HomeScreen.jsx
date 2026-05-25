// Digital Home — Home screen

const { useState } = React;

const SHARED = [
  { id: 'OUR-X7K2', name: 'Sunset Apartment', members: 3 },
];

function HomeScreen({ name, onNavigate, onLogout }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#1a1a1a', overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ padding: '20px 20px 48px', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h1 style={{
            fontSize: 19, fontWeight: 600, color: '#f5f0e8',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="home" size={17} color="#c4a882" />
            {name}'s Home
          </h1>
          <BtnIcon onClick={onLogout} title="Leave home">
            <Icon name="door-open" size={16} />
          </BtnIcon>
        </header>

        {/* Date */}
        <p style={{ color: '#8a7f6e', fontSize: 12, marginBottom: 14 }}>{dateStr}</p>

        {/* Greeting */}
        <p style={{
          color: '#c4a882', fontSize: 14, fontWeight: 500,
          marginBottom: 16, paddingBottom: 14,
          borderBottom: '1px solid #2b2b2b',
        }}>
          Welcome back, {name} ✨
        </p>

        {/* Widgets */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <WeatherPill temp="18°C" condition="Partly cloudy" iconName="cloud-sun" />
          <div style={{ flex: 1, minWidth: 120 }}>
            <p style={{ fontSize: 12, color: '#8a7f6e', fontStyle: 'italic', lineHeight: 1.55 }}>
              "A room without books is like a body without a soul."
            </p>
            <p style={{ fontSize: 11, color: '#8a7f6e', marginTop: 2 }}>— Marcus Tullius Cicero</p>
          </div>
        </div>

        {/* Room grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          <RoomCard
            icon={<Icon name="bed" size={17} color="#c4a882" />}
            name={`${name}'s Room`}
            description="Personal tasks and notes"
            summary="3 remaining"
            accent="#c4a882"
            onClick={() => onNavigate('room/my-room')}
          />
          <RoomCard
            icon={<Icon name="book-open" size={17} color="#7a9e6b" />}
            name={`${name}'s Study`}
            description="University tasks, notes, pomodoro"
            summary="5 remaining"
            accent="#7a9e6b"
            onClick={() => onNavigate('room/study')}
          />
          <RoomCard
            icon={<Icon name="briefcase" size={17} color="#6b8f9e" />}
            name={`${name}'s Work`}
            description="Job tasks, notes, quick links"
            summary="2 remaining"
            accent="#6b8f9e"
            onClick={() => onNavigate('room/work')}
          />
        </div>

        {/* Shared rooms */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h2 style={{
              fontSize: 14, fontWeight: 600, color: '#f5f0e8',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="wifi" size={14} color="#c4a882" /> Shared Rooms
            </h2>
            <div style={{ display: 'flex', gap: 6 }}>
              <BtnSmall><Icon name="plus" size={11} /> Create</BtnSmall>
              <BtnSmall ghost>Join</BtnSmall>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SHARED.map((r) => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#242424', border: '1px solid rgba(196,168,130,0.14)',
                borderRadius: 14, padding: '12px 16px', cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(196,168,130,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="wifi" size={16} color="#c4a882" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#f5f0e8' }}>{r.name}</p>
                  <p style={{ fontSize: 11, color: '#8a7f6e', fontFamily: 'monospace', letterSpacing: '0.05em', marginTop: 1 }}>
                    {r.id} · {r.members} members
                  </p>
                </div>
                <Icon name="arrow-right" size={15} color="#8a7f6e" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen });

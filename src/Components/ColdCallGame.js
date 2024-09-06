import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const techniques = [
  { 
    name: 'Mirroring', 
    points: 5,
    examples: [
      "Owner: 'I'm not interested in selling right now.' You: 'Not interested in selling right now?'",
      "Owner: 'The cap rates in this area seem too low.' You: 'The cap rates seem too low?'",
      "Owner: 'We're considering a 1031 exchange.' You: 'Considering a 1031 exchange?'",
      "Owner: 'Our occupancy rates have been fluctuating lately.' You: 'Your occupancy rates have been fluctuating?'",
      "Owner: 'I'm worried about the new rent control laws.' You: 'Worried about the new rent control laws?'",
      "Owner: 'The market seems overvalued right now.' You: 'The market seems overvalued?'",
      "Owner: 'We're looking to expand our portfolio.' You: 'Looking to expand your portfolio?'",
      "Owner: 'The property needs significant renovations.' You: 'Significant renovations?'",
      "Owner: 'We're concerned about interest rate hikes.' You: 'Concerned about interest rate hikes?'",
      "Owner: 'The NOI has been declining.' You: 'The NOI has been declining?'"
    ]
  },
  // Add other techniques here...
];

const ColdCallGame = () => {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [notification, setNotification] = useState(null);
  const [level, setLevel] = useState(1);
  const [usedExamples, setUsedExamples] = useState({});

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const handleExampleUse = (techniqueName, exampleIndex) => {
    const technique = techniques.find(t => t.name === techniqueName);
    if (technique) {
      const newPoints = points + technique.points;
      setPoints(newPoints);
      setStreak(streak + 1);
      showNotification(`+${technique.points} points!`);

      if (streak % 3 === 0) {
        setPoints(newPoints + 20);
        showNotification('Streak Bonus: +20 points!');
      }

      if (newPoints >= level * 100) {
        setLevel(level + 1);
        showNotification(`Level Up! You're now level ${level + 1}`);
      }

      setUsedExamples(prev => ({
        ...prev,
        [techniqueName]: [
          ...(prev[techniqueName] || []),
          exampleIndex
        ]
      }));
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Never Split the Difference Challenge - CRE Edition</CardTitle>
        <CardDescription>Hone your CRE negotiation skills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xl">Total Points: {points}</p>
            <p>Streak: {streak}</p>
            <p>Level: {level}</p>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2" />
            <span className="text-xl">{formatTime(timer)}</span>
            <Button onClick={toggleTimer} variant="outline" className="ml-2">
              {isActive ? 'Pause' : 'Start'}
            </Button>
          </div>
        </div>

        {techniques.map((technique) => (
          <Card key={technique.name} className="mt-4">
            <CardHeader>
              <CardTitle>{technique.name} ({technique.points} points)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Example</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technique.examples.map((example, index) => (
                    <TableRow key={index}>
                      <TableCell>{example}</TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleExampleUse(technique.name, index)}
                          variant={usedExamples[technique.name]?.includes(index) ? "secondary" : "outline"}
                          disabled={usedExamples[technique.name]?.includes(index)}
                        >
                          {usedExamples[technique.name]?.includes(index) ? "Used" : "Use"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        {notification && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Notification</AlertTitle>
            <AlertDescription>{notification}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">CRE Challenges:</h2>
          <ul className="list-disc list-inside">
            <li>First 15 Minutes: Double points for any technique</li>
            <li>Streak Bonus: +20 points for using 3 different techniques in a row</li>
            <li>Market Expert: +15 points for correctly citing a local market trend or statistic</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => {
            setPoints(0);
            setStreak(0);
            setTimer(0);
            setIsActive(false);
            setLevel(1);
            setUsedExamples({});
            showNotification('Game reset!');
          }}
          variant="destructive"
        >
          Reset Game
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ColdCallGame;
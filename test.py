from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class BoggleTests(TestCase):
    """Flask integration tests for Boggle app"""

    def setUp(self):
        """Runs before every test"""
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_main_page(self):
        """Tests main game page"""
        with self.client:
            resp = self.client.get('/')

            #check status code
            self.assertEqual(resp.status_code, 200)

            #check response body as string
            html = resp.data.decode('utf-8')
            self.assertIn('<h1>BOGGLE!</h1>', html)
            self.assertIn('<p>Times Played:', html)
            self.assertIn('<p>Highscore:', html)
            self.assertIn('<p>Score:', html)
            self.assertIn('<p>Timer:', html)

            #check session
            self.assertIn('board', session)
            

    def test_check_word(self):
        """Modifying board in session, tests if submitted words are checked and server sends back response"""
        
        with self.client:
            with self.client.session_transaction() as change_board:
                change_board['board'] = [["T", "C", "Q", "Y", "T"], 
                                         ["T", "E", "S", "T", "E"], 
                                         ["C", "A", "S", "T", "S"], 
                                         ["Q", "A", "N", "M", "T"], 
                                         ["W", "W", "I", "P", "T"]]
            
            resp = self.client.get('/check-word?guess=test')
            self.assertEqual(resp.json['result'], "ok")

            #check status code
            self.assertEqual(resp.status_code, 200)

    def test_end_game(self):
        """Tests checking if score is greater than highscore"""
        with self.client:
            with self.client.session_transaction() as set_hs:
                set_hs['highscore'] = 55

            #check response data
            resp = self.client.post('/end-game', json={'score': 59})
            self.assertEqual(resp.json['new_highscore'], True)

            #check status code
            self.assertEqual(resp.status_code, 200)

    def test_redirect(self):
        """Tests redirects to page reload"""
        with self.client:
            resp = self.client.post('/play-again', follow_redirects = True)

            #check response data as string
            html = resp.data.decode('utf-8')
            self.assertIn('<h1>BOGGLE!</h1>', html)
            
            #check status code
            self.assertEqual(resp.status_code, 200)

           
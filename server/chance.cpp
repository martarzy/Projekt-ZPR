#include <deque>
#include <boost/python.hpp>
#include <boost/python/dict.hpp>
#include <memory>
#include <random>
#include <chrono>
#include <algorithm>

class ChanceCard
{
public:
    ChanceCard()
    {
        message["message"] = "message";
    }

    boost::python::dict getMessage() { return message; }

protected:
    boost::python::dict message;
};

class GotoCard : public ChanceCard
{
public:
    GotoCard(int field_no)
    {
        message["action"] = "goto";
        message["field"] = field_no;
    }
};

class MoveCard : public ChanceCard
{
public:
    MoveCard(int move)
    {
        message["action"] = "move";
        message["move"] = move;
    }
};

class CashCard : public ChanceCard
{
public:
    CashCard(int cash, std::string reason)
    {
        message["action"] = "cash";
        message["cash"] = cash;
        message["reason"] = reason;
    }
};

class GetOutCard : public ChanceCard
{
public:
    GetOutCard()
    {
        message["action"] = "getOut";
    }
};

class GotoJailCard : public ChanceCard
{
public:
    GotoJailCard()
    {
        message["action"] = "gotoJail";
    }
};

class ChanceStack
{
public:
    typedef std::shared_ptr<ChanceCard> ChanceCardP;
    ChanceStack()
    {
        cards.push_back(ChanceCardP(new GotoCard(5)));
        cards.push_back(ChanceCardP(new GotoCard(15)));
        cards.push_back(ChanceCardP(new GotoCard(25)));
        cards.push_back(ChanceCardP(new GotoCard(35)));

        cards.push_back(ChanceCardP(new MoveCard(2)));
        cards.push_back(ChanceCardP(new MoveCard(4)));
        cards.push_back(ChanceCardP(new MoveCard(-2)));
        cards.push_back(ChanceCardP(new MoveCard(-4)));

        cards.push_back(ChanceCardP(new CashCard(50, std::string("birthday"))));
        cards.push_back(ChanceCardP(new CashCard(100, std::string("investment"))));
        cards.push_back(ChanceCardP(new CashCard(-50, std::string("treatment"))));
        cards.push_back(ChanceCardP(new CashCard(-100, std::string("accident"))));

        for (int i = 0 ; i < 4 ; ++i)
        {
            cards.push_back(ChanceCardP(new GetOutCard()));
            cards.push_back(ChanceCardP(new GotoJailCard()));
        }

        std::shuffle (cards.begin(), cards.end(), std::default_random_engine(std::chrono::system_clock::now().time_since_epoch().count()));
    }

    boost::python::dict getCard()
    {
        ChanceCardP card = cards.back();
        if (card->getMessage()["action"] == "getOut")
            cards.pop_back();
        else
            std::rotate(cards.begin(), cards.end()-1, cards.end());
        return card->getMessage();
    }

    void returnGetOutCard()
    {
        cards.push_front(ChanceCardP(new GetOutCard()));
    }

private:
    std::deque<ChanceCardP> cards;
};

BOOST_PYTHON_MODULE(chance)
{
    using namespace boost::python;
    class_<ChanceStack>("ChanceStack", init<>())
            .def ("get_card", &ChanceStack::getCard)
            .def ("return_get_out_card", &ChanceStack::returnGetOutCard)
    ;
}
